
PORT=$(grep '^port:' /fedired/.config/default.yml | awk 'NR==1{print $2; exit}')
curl -Sfso/dev/null "http://localhost:${PORT}/healthz"
