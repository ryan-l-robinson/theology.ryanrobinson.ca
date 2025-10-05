import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import {execSync} from 'child_process';

import pluginFilters from "./11ty-theme/_config/filters.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({ "public/": "/" })
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl")
		.addPassthroughCopy("./CNAME");

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Adds the {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
	// Adds the {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	// Atom Feed
	eleventyConfig.addPlugin(feedPlugin, {
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		collection: {
			name: "posts",
			limit: 20,
		},
		metadata: {
			language: "en",
			title: "Ryan Robinson Theology",
			subtitle: "Ryan Robinson writes about theology: God, the church, the world, and whatever else he feels like that day.",
			base: "https://theology.ryanrobinson.ca/",
			author: {
				name: "Ryan Robinson"
			}
		}
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// File extensions to process in _site folder
		extensions: "html",

		// Output formats for each image.
		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		defaultAttributes: {
			// e.g. <img loading decoding> assigned on the HTML tag will override these values.
			loading: "lazy",
			decoding: "async",
		}
	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Build search index
	eleventyConfig.on('eleventy.after', () => {
	  execSync(`npx pagefind --site _site`, { encoding: 'utf-8' })
	})

	eleventyConfig.addCollection("tagPages", function(collectionApi) {
		const posts = collectionApi.getFilteredByTag("posts").reverse();
		const tagMap = new Map();
		const pageSize = 10;
		const tagPages = [];
		const slugify = eleventyConfig.getFilter("slugify");

		// Exclude utility tags
		const filterTagList = tags => (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);

		// Group posts by tag
		for (const post of posts) {
			const tags = filterTagList(post.data.tags);
			for (const tag of tags) {
				if (!tagMap.has(tag)) {
					tagMap.set(tag, []);
				}
				tagMap.get(tag).push(post);
			}
		}

		// Create paginated pages for each tag
		for (const [tag, posts] of tagMap.entries()) {
			const pageCount = Math.ceil(posts.length / pageSize);
			const tagSlug = slugify(tag);
			const pages = [];

			for (let i = 0; i < pageCount; i++) {
				const start = i * pageSize;
				const end = start + pageSize;
				pages.push({
					tagName: tag,
					pageNumber: i,
					totalPages: pageCount,
					posts: posts.slice(start, end)
				});
			}

			// Add pagination data to each page
			for (let i = 0; i < pageCount; i++) {
				const hrefs = [];
				for (let j = 0; j < pageCount; j++) {
					hrefs.push(j === 0 ? `/tags/${tagSlug}/` : `/tags/${tagSlug}/${j + 1}/`);
				}

				pages[i].pagination = {
					hrefs: hrefs,
					href: {
						first: hrefs[0],
						last: hrefs[hrefs.length - 1]
					},
					pages: pages.map((p, j) => ({ url: hrefs[j] })), // Simplified for template compatibility
					pageNumber: i,
					totalPages: pageCount
				};
			}

			tagPages.push(...pages);
		}

		return tagPages;
	});

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
			"11ty.js",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../11ty-theme/_includes",  // default: "_includes" (`input` relative)
			data: "../_data",          // default: "_data" (`input` relative)
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.

		// pathPrefix: "/",
	};
};
