mkdir -p lib/cjs

echo "writing cjs package.json"

cat >lib/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

mkdir -p lib/mjs

echo "writing mjs package.json"

cat >lib/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF