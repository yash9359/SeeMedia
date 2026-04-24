export const timeAgo = (date) => {
    if (!date) return "just now";

    const now = new Date();
    const commentDate = new Date(date);
    if (Number.isNaN(commentDate.getTime())) return "just now";

    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    if (!Number.isFinite(diffInSeconds) || diffInSeconds < 0) return "just now";

    if (diffInSeconds < 60) {
        return `${diffInSeconds} ${diffInSeconds === 1 ? "second" : "seconds"} ago`;
    }
    else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    else if (diffInSeconds < 604800) { // < 7 days
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    else if (diffInSeconds < 2592000) { // < 30 days
        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
};