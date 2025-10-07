import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PerformanceNavigation.scss";
import { SearchIcon } from "@/components/Svg";

const performanceTopics = [
  {
    id: "memoization",
    title: "Memoization",
    description:
      "Prevent unnecessary re-renders with React.memo, useMemo, and useCallback",
    category: "Runtime Performance",
    icon: "🧠",
    color: "#000",
    features: ["React.memo", "useMemo", "useCallback", "Custom memoization"],
    status: "ready",
  },
  {
    id: "virtualization",
    title: "Virtualization",
    description:
      "Render only visible items in large lists for better performance",
    category: "Runtime Performance",
    icon: "📊",
    color: "#000",
    features: [
      "Window scrolling",
      "Dynamic heights",
      "Infinite lists",
      "Grid virtualization",
    ],
    status: "ready",
  },
  {
    id: "web-workers",
    title: "Web Workers",
    description: "Offload heavy computations to background threads",
    category: "Runtime Performance",
    icon: "⚡",
    color: "#000",
    features: [
      "Background processing",
      "Heavy calculations",
      "Non-blocking UI",
      "Message passing",
    ],
    status: "implemented",
  },
  {
    id: "lazy-image",
    title: "Lazy Image Loading",
    description: "Load images based on viewport and network conditions",
    category: "Runtime Performance",
    icon: "🖼️",
    color: "#000",
    features: [
      "Intersection Observer",
      "Network-aware loading",
      "Progressive enhancement",
      "Blur placeholders",
    ],
    status: "ready",
  },
  {
    id: "prefetch-on-demand",
    title: "On-Demand Prefetch",
    description:
      "Smart prefetching based on user interactions and hover events",
    category: "Runtime Performance",
    icon: "🎯",
    color: "#000",
    features: [
      "Hover-based prefetch",
      "Cancel on mouse leave",
      "Progress tracking",
      "Webpack chunk names",
    ],
    status: "implemented",
  },
  {
    id: "prefetch-lazy-viewport",
    title: "Lazy Viewport Loading",
    description: "Load components when they enter the viewport",
    category: "Runtime Performance",
    icon: "👁️",
    color: "#000",
    features: [
      "Intersection Observer",
      "Viewport detection",
      "Progressive loading",
      "Performance optimization",
    ],
    status: "ready",
  },
  {
    id: "cdn",
    title: "CDN Optimization",
    description: "Serve assets from edge locations for faster delivery",
    category: "Runtime Performance",
    icon: "🌐",
    color: "#000",
    features: [
      "Geographic caching",
      "Edge delivery",
      "Asset optimization",
      "Cache strategies",
    ],
    status: "ready",
  },
  {
    id: "tree-shaking",
    title: "Tree Shaking",
    description: "Eliminate unused code from bundles to reduce size",
    category: "Build Optimization",
    icon: "🌳",
    color: "#000",
    features: [
      "Dead code elimination",
      "ES6 modules",
      "Bundle analysis",
      "Import optimization",
    ],
    status: "ready",
  },
  {
    id: "css-in-js",
    title: "CSS-in-JS Optimization",
    description: "Optimize CSS delivery and reduce bundle size",
    category: "Build Optimization",
    icon: "🎨",
    color: "#000",
    features: [
      "Critical CSS",
      "Code splitting",
      "Runtime optimization",
      "Bundle analysis",
    ],
    status: "ready",
  },
  {
    id: "defer-async",
    title: "Defer & Async Loading",
    description: "Defer non-critical code loading for better performance",
    category: "Build Optimization",
    icon: "⏰",
    color: "#000",
    features: [
      "Dynamic imports",
      "Code splitting",
      "Lazy loading",
      "Bundle optimization",
    ],
    status: "ready",
  },
];

// Category colors
const categoryColors = {
  "Runtime Performance": "#e74c3c",
  "Build Optimization": "#3498db",
};

// Status colors
const statusColors = {
  ready: "#95a5a6",
  implemented: "#27ae60",
  "in-progress": "#f39c12",
  planned: "#e67e22",
};

const routeMap: Record<string, string> = {
  "prefetch-on-demand": "/topics/prefetch/on-demand",
  "prefetch-lazy-viewport": "/topics/prefetch/lazy-viewport",
  memoization: "/topics/memoization",
  virtualization: "/topics/virtualization",
  "web-workers": "/topics/web-workers",
  "lazy-image": "/topics/lazy-image",
  cdn: "/topics/cdn",
  "tree-shaking": "/topics/tree-shaking",
  "css-in-js": "/topics/css-in-js",
  "defer-async": "/topics/defer-async",
};

export function PerformanceNavigation() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredTopics = performanceTopics.filter((topic) => {
    const matchesCategory =
      !selectedCategory || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });


  const categories = [
    ...new Set(performanceTopics.map((topic) => topic.category)),
  ];

  return (
    <div className="performance-navigation">
      <div className="title-container">
        <h1 className="title-container-t">React Performance Playbook</h1>
        <p>
          Faster loads, smoother interactions, and smaller bundles—practical
          techniques that scale.
        </p>
      </div>

      <div className="navigation-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">
            <SearchIcon />
          </span>
        </div>

        <div className="category-filters">
          <button
            className={`filter-btn ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
              style={{
                borderColor:
                  categoryColors[category as keyof typeof categoryColors],
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="topics-grid">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`topic-card ${topic.status}`}
            style={{ borderColor: topic.color }}
            onClick={() => {
              const route = routeMap[topic.id];
              if (route) {
                navigate(route);
              } else {
                console.log(`Route not implemented for ${topic.id}`);
              }
            }}
          >
            <div className="card-header">
              <div
                className="topic-icon"
                style={{ backgroundColor: topic.color }}
              >
                {topic.icon}
              </div>
              <div className="topic-meta">
                <h3>{topic.title}</h3>
                <span
                  className="category-badge"
                  style={{
                    backgroundColor:
                      categoryColors[
                        topic.category as keyof typeof categoryColors
                      ],
                  }}
                >
                  {topic.category}
                </span>
              </div>
            </div>

            <div className="card-body">
              <p className="topic-description">{topic.description}</p>

              <div className="features-list">
                <h4>Key Features:</h4>
                <ul>
                  {topic.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-footer">
              <div className="status-indicator">
                <span
                  className="status-dot"
                  style={{
                    backgroundColor:
                      statusColors[topic.status as keyof typeof statusColors],
                  }}
                />
                <span className="status-text">
                  {topic.status === "implemented"
                    ? "✅ Implemented"
                    : topic.status === "ready"
                    ? "📋 Ready to Implement"
                    : topic.status === "in-progress"
                    ? "🚧 In Progress"
                    : "📅 Planned"}
                </span>
              </div>

              <button
                className="explore-btn"
                style={{ backgroundColor: topic.color }}
                onClick={(e) => {
                  e.stopPropagation();

                  const route = routeMap[topic.id];
                  if (route) {
                    navigate(route);
                  }
                }}
              >
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="no-results">
          <h3>No topics found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="navigation-footer">
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{performanceTopics.length}</span>
            <span className="stat-label">Total Topics</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {
                performanceTopics.filter((t) => t.status === "implemented")
                  .length
              }
            </span>
            <span className="stat-label">Implemented</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {
                performanceTopics.filter(
                  (t) => t.category === "Runtime Performance"
                ).length
              }
            </span>
            <span className="stat-label">Runtime Topics</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {
                performanceTopics.filter(
                  (t) => t.category === "Build Optimization"
                ).length
              }
            </span>
            <span className="stat-label">Build Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceNavigation;
