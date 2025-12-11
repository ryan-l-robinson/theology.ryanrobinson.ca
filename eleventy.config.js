import themePlugin from "./11ty-theme/config.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	// 1. Add the Theme Plugin
	eleventyConfig.addPlugin(themePlugin, {
		feedMetadata: {
			language: "en",
			title: "Ryan Robinson Theology",
			subtitle:
				"Ryan Robinson writes about theology: God, the church, the world, and whatever else he feels like that day.",
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
