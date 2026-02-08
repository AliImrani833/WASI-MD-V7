# ═══════════════════════════════════════════════════════════════════
#  WASI-MD-V7 Heroku Dockerfile
#  Pulls and runs the actual bot image
# ═══════════════════════════════════════════════════════════════════

FROM mrwasi/wasi-md-v7:latest

# Heroku requires binding to $PORT
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Start the bot
CMD ["node", "index.js"]
