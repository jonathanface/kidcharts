package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const (
	staticDir  = "static/dist"
	defaultPort = "8080"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	addr := ":" + port

	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	fileServer := http.FileServer(http.Dir(staticDir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Serve static files if they exist, otherwise serve index.html (SPA fallback)
		requestedPath := filepath.Join(staticDir, r.URL.Path)
		absStaticDir, _ := filepath.Abs(staticDir)
		absRequestedPath, _ := filepath.Abs(requestedPath)

		if !strings.HasPrefix(absRequestedPath, absStaticDir) {
			http.Error(w, "Invalid path", http.StatusBadRequest)
			return
		}

		if info, err := os.Stat(absRequestedPath); err == nil && !info.IsDir() {
			if strings.HasPrefix(r.URL.Path, "/assets/") || strings.Contains(r.URL.Path, ".") {
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			}
			fileServer.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Cache-Control", "no-store")
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
	})

	log.Printf("KidCharts listening on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}
