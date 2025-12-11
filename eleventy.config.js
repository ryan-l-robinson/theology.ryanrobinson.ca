import themePlugin from "./11ty-theme/config.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	// 1. Add the Theme Plugin
	// Values passed here impact the Atom feed.
	eleventyConfig.addPlugin(themePlugin, {
		feedMetadata: {
			language: "en-ca",
			title: "Ryan Robinson Theology",
			subtitle:
				"A guy with a little theological training writing about God, the church, and the world.",
			base: "https://theology.ryanrobinson.ca/",
			author: {
				name: "Ryan Robinson",
			},
		},
	});

	// 2. Site-Specific Passthroughs
	eleventyConfig.addPassthroughCopy({ "public/": "/" });
	eleventyConfig.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");
	eleventyConfig.addPassthroughCopy("./CNAME");

	// 3. Watch Targets
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// 4. Return standard dir config
	return {
		templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "content",
			includes: "../11ty-theme/_includes",
			data: "../_data",
			output: "_site",
		},
	};
}
