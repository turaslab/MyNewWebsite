#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$project_root/tugratunc.me"
build_dir="$project_root/dist"

test -f "$source_dir/index.html"
test -f "$source_dir/css/style.css"
test -f "$source_dir/js/main.js"

rm -rf "$build_dir"
mkdir -p "$build_dir/client" "$build_dir/server"
cp -R "$source_dir"/. "$build_dir/client"/

cat > "$build_dir/server/index.js" <<'EOF'
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.split('/').pop()?.includes('.')) {
      url.pathname = `${url.pathname.replace(/\/$/, '')}/index.html`;
      response = await env.ASSETS.fetch(new Request(url, request));
    }

    return response;
  },
};
EOF

cat > "$build_dir/server/wrangler.json" <<'EOF'
{
  "name": "turas-lab",
  "main": "index.js",
  "compatibility_date": "2026-09-03",
  "assets": {
    "directory": "../client",
    "binding": "ASSETS"
  }
}
EOF

printf 'Built Tura\047s Lab into %s\n' "$build_dir"
