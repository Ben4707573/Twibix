#!/bin/bash

# Backup the original files
mkdir -p /tmp/cube-timer-backup
cp -r /home/bengo/Documents/programing/rubiks-cube-timer/* /tmp/cube-timer-backup/

# Remove console.log statements from all JS and JSX files
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/console\.log/d' {}

# Remove debug-related comments (but keep comments in settings section about debug mode)
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/\/\/ Debug/d' {}
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/\/\/ For debugging/d' {}
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/\/\* Debug/d' {}
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/\/\* For debugging/d' {}
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/Log every second for debugging/d' {}
find /home/bengo/Documents/programing/rubiks-cube-timer -name "*.js" -o -name "*.jsx" | xargs -I{} sed -i '/Use our fixed visualizer directly for debugging/d' {}

# Remove the "addTestSolve" function since it's only for debugging
sed -i '/const addTestSolve/,/};/d' /home/bengo/Documents/programing/rubiks-cube-timer/app/cube-timer.jsx

echo "Debug code cleanup complete."
