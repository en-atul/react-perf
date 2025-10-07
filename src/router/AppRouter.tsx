import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NavigationHeader } from "../components/NavigationHeader";
import "./AppLayout.scss";

const PerformanceNavigation = React.lazy(
  () =>
    import(
      /* webpackChunkName: "performance-navigation" */ "../topics/performance/PerformanceNavigation"
    )
);
const TopicPlaceholder = React.lazy(
  () =>
    import(
      /* webpackChunkName: "topic-placeholder" */ "../components/TopicPlaceholder"
    )
);

const OnDemandPrefetch = React.lazy(
  () =>
    import(
      /* webpackChunkName: "performance-on-demand" */ "../topics/performance/prefetch/on-demand"
    )
);

const PrefetchDemoPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "performance-advanced" */ "../topics/performance/prefetch/lazy-viewport"
    )
);

const WebWorkersDemo = React.lazy(
  () =>
    import(
      /* webpackChunkName: "performance-web-workers" */ "../topics/performance/web-workers"
    )
);


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <NavigationHeader />
      <main className="app-main">
        <React.Suspense fallback={<div>Loading...</div>}>
          {children}
        </React.Suspense>
      </main>
    </div>
  );
}

// Main App Router
export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <PerformanceNavigation />
            </Layout>
          }
        />

        <Route
          path="/topics/prefetch/on-demand"
          element={
            <Layout>
              <OnDemandPrefetch />
            </Layout>
          }
        />

        <Route
          path="/topics/prefetch/advanced"
          element={
            <Layout>
              <PrefetchDemoPage />
            </Layout>
          }
        />

        <Route
          path="/topics"
          element={
            <Layout>
              <PerformanceNavigation />
            </Layout>
          }
        />

        {/* Placeholder routes for unimplemented topics */}
        <Route
          path="/topics/memoization"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="memoization"
                title="Memoization"
                description="Prevent unnecessary re-renders with React.memo, useMemo, and useCallback"
                icon="🧠"
                color="#e74c3c"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/virtualization"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="virtualization"
                title="Virtualization"
                description="Render only visible items in large lists for better performance"
                icon="📊"
                color="#9b59b6"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/web-workers"
          element={
            <Layout>
              <WebWorkersDemo />
            </Layout>
          }
        />

        <Route
          path="/topics/lazy-image"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="lazy-image"
                title="Lazy Image Loading"
                description="Load images based on viewport and network conditions"
                icon="🖼️"
                color="#3498db"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/cdn"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="cdn"
                title="CDN Optimization"
                description="Serve assets from edge locations for faster delivery"
                icon="🌐"
                color="#34495e"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/tree-shaking"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="tree-shaking"
                title="Tree Shaking"
                description="Eliminate unused code from bundles to reduce size"
                icon="🌳"
                color="#8e44ad"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/css-in-js"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="css-in-js"
                title="CSS-in-JS Optimization"
                description="Optimize CSS delivery and reduce bundle size"
                icon="🎨"
                color="#e67e22"
              />
            </Layout>
          }
        />

        <Route
          path="/topics/defer-async"
          element={
            <Layout>
              <TopicPlaceholder
                topicId="defer-async"
                title="Defer & Async Loading"
                description="Defer non-critical code loading for better performance"
                icon="⏰"
                color="#2c3e50"
              />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
