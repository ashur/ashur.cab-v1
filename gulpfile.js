const gulp = require( 'gulp' );

var paths =
{
	articles: {
		src: "src/articles/published",
		dest: "dist/articles"
	}
};

gulp.task( 'articles:build', function()
{
	return gulp
		.src( `${paths.articles.src}/**/*.md` )
		.pipe( gulp.dest( `${paths.articles.dest}` ) );
});

/* Builds */
gulp.task( 'build:dev', ['articles:build'] );
gulp.task( 'build:dist', ['articles:build'] );
