interface PreloadResource {
	href: string;
	as: "script" | "style" | "image" | "font";
	type?: string;
	crossorigin?: "anonymous" | "use-credentials";
}

class PreloadManager {
	private preloadedResources = new Set<string>();
	private criticalImages = new Set<string>();

	// Preload critical resources
	preloadResource(resource: PreloadResource) {
		if (this.preloadedResources.has(resource.href)) {
			return;
		}

		const link = document.createElement("link");
		link.rel = "preload";
		link.href = resource.href;
		link.as = resource.as;

		if (resource.type) {
			link.type = resource.type;
		}

		if (resource.crossorigin) {
			link.crossOrigin = resource.crossorigin;
		}

		document.head.appendChild(link);
		this.preloadedResources.add(resource.href);

		console.log("🚀 Preloaded resource:", resource.href);
	}

	// Preload critical images (like dog avatars that are likely to be viewed)
	preloadImage(src: string, priority: "high" | "low" = "low") {
		if (this.criticalImages.has(src)) {
			return;
		}

		if (priority === "high") {
			this.preloadResource({
				href: src,
				as: "image",
			});
		} else {
			// Use requestIdleCallback for low priority preloading
			if ("requestIdleCallback" in window) {
				requestIdleCallback(() => {
					const img = new Image();
					img.src = src;
				});
			}
		}

		this.criticalImages.add(src);
	}

	// Preload critical fonts
	preloadFonts() {
		// Preload any critical fonts here
		const criticalFonts = [
			// Add your critical font URLs here
			// '/fonts/inter-var.woff2'
		];

		criticalFonts.forEach((font) => {
			this.preloadResource({
				href: font,
				as: "font",
				type: "font/woff2",
				crossorigin: "anonymous",
			});
		});
	}

	// Clean up preloaded resources
	cleanup() {
		this.preloadedResources.clear();
		this.criticalImages.clear();
	}
}

export const preloadManager = new PreloadManager();

// Initialize critical preloads
export const initializeCriticalPreloads = () => {
	preloadManager.preloadFonts();

	// Preload placeholder image
	preloadManager.preloadImage("/placeholder.svg", "high");

	console.log("✅ Critical resources preloaded");
};
