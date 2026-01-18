import prisma from './src/config/db.js';

async function main() {
    try {
        console.log("Testing database connection...");
        const userCount = await prisma.user.count();
        console.log("Database connection successful. User count:", userCount);
        process.exit(0);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

main();
