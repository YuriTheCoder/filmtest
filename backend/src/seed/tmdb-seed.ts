import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import slugify from 'slugify';
import * as argon2 from 'argon2';

async function bootstrap() {
  console.log('🎬 Cinema App - TMDB Seeder');
  console.log('================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const tmdb = app.get(TmdbService);

  try {
    // Step 1: Create admin user if doesn't exist
    console.log('👤 Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cinema.com';
    const adminExists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const passwordHash = await argon2.hash(process.env.ADMIN_PASSWORD || 'Admin@123');
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: process.env.ADMIN_NAME || 'Admin User',
          passwordHash,
          role: 'ADMIN',
        },
      });
      console.log(`✅ Admin user created: ${adminEmail}\n`);
    } else {
      console.log('✅ Admin user already exists\n');
    }

    // Step 2: Sync genres
    console.log('🎭 Syncing genres from TMDB...');
    const tmdbGenres = await tmdb.getGenres();
    let genresCreated = 0;

    for (const tmdbGenre of tmdbGenres) {
      const slug = slugify(tmdbGenre.name, { lower: true, strict: true });

      await prisma.genre.upsert({
        where: { tmdbId: tmdbGenre.id },
        update: { name: tmdbGenre.name, slug },
        create: {
          tmdbId: tmdbGenre.id,
          name: tmdbGenre.name,
          slug,
        },
      });
      genresCreated++;
    }
    console.log(`✅ ${genresCreated} genres synced\n`);

    // Step 3: Fetch movies from multiple sources
    console.log('🎥 Fetching movies from TMDB...');
    const movieIds = new Set<number>();

    // Fetch popular movies (5 pages = 100 movies)
    console.log('  📊 Fetching popular movies (5 pages)...');
    for (let page = 1; page <= 5; page++) {
      const popular = await tmdb.getPopular(page);
      popular.results.forEach((movie) => movieIds.add(movie.id));
      console.log(`    Page ${page}/5 - ${popular.results.length} movies`);
    }

    // Fetch trending movies
    console.log('  🔥 Fetching trending movies...');
    const trending = await tmdb.getTrending('week');
    trending.results.forEach((movie) => movieIds.add(movie.id));
    console.log(`    ${trending.results.length} trending movies`);

    // Discover highly rated movies
    console.log('  ⭐ Discovering highly rated movies...');
    const highRated = await tmdb.discoverMovies({
      sortBy: 'vote_average.desc',
      page: 1,
    });
    highRated.results.forEach((movie) => movieIds.add(movie.id));
    console.log(`    ${highRated.results.length} highly rated movies`);

    console.log(`\n📦 Total unique movies to import: ${movieIds.size}\n`);

    // Step 4: Import movie details
    console.log('💾 Importing movie details (this will take 3-5 minutes)...\n');
    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (const movieId of Array.from(movieIds)) {
      try {
        // Check if already exists
        const existing = await prisma.movie.findUnique({
          where: { tmdbId: movieId },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Fetch full details
        const details = await tmdb.getMovieDetails(movieId);

        // Skip if missing critical data
        if (!details.title || !details.release_date || !details.runtime) {
          skipped++;
          continue;
        }

        const year = parseInt(details.release_date.split('-')[0]);
        const slug = slugify(`${details.title}-${year}`, {
          lower: true,
          strict: true,
        });

        // Create movie
        const movie = await prisma.movie.create({
          data: {
            tmdbId: details.id,
            title: details.title,
            slug,
            synopsis: details.overview || 'No synopsis available.',
            year,
            runtime: details.runtime,
            country:
              details.production_countries?.[0]?.iso_3166_1 || 'US',
            originalLanguage: details.original_language,
            directors: tmdb.getDirectors(details.credits),
            cast: tmdb.getCast(details.credits),
            posterUrl: tmdb.getPosterUrl(details.poster_path),
            backdropUrl: tmdb.getBackdropUrl(details.backdrop_path),
            trailerUrl: tmdb.getTrailerUrl(details.videos),
            parentalRating: tmdb.getParentalRating(details.release_dates),
            popularity: details.popularity,
            avgRating: details.vote_average,
            ratingsCount: details.vote_count,
          },
        });

        // Connect genres
        if (details.genres && details.genres.length > 0) {
          const genreIds = details.genres.map((g) => g.id);
          const genres = await prisma.genre.findMany({
            where: { tmdbId: { in: genreIds } },
          });

          await prisma.movie.update({
            where: { id: movie.id },
            data: {
              genres: {
                connect: genres.map((g) => ({ id: g.id })),
              },
            },
          });
        }

        imported++;

        if (imported % 10 === 0) {
          console.log(`  ✅ Progress: ${imported} movies imported...`);
        }
      } catch (error) {
        failed++;
        console.error(`  ❌ Failed to import movie ID ${movieId}: ${error.message}`);
      }
    }

    // Step 5: Summary
    console.log('\n================================');
    console.log('✅ Seeding Complete!');
    console.log('================================\n');
    console.log(`📊 Statistics:`);
    console.log(`  • Genres synced:    ${genresCreated}`);
    console.log(`  • Movies imported:  ${imported}`);
    console.log(`  • Movies skipped:   ${skipped}`);
    console.log(`  • Failures:         ${failed}`);
    console.log(`  • Total processed:  ${movieIds.size}`);
    console.log('\n🚀 Your cinema database is ready!');
    console.log('   Start the dev server: npm run dev\n');

    // Create sync log
    await prisma.syncLog.create({
      data: {
        type: 'TMDB_SEED',
        status: 'SUCCESS',
        message: 'Initial database seed completed',
        stats: {
          genres: genresCreated,
          imported,
          skipped,
          failed,
          total: movieIds.size,
        },
      },
    });
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);

    // Log failure
    await prisma.syncLog.create({
      data: {
        type: 'TMDB_SEED',
        status: 'FAILURE',
        message: error.message,
      },
    });

    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
