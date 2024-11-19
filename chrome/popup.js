document.addEventListener('DOMContentLoaded', function () {
    // Retrieve tab count and display it
    chrome.tabs.query({}, function (tabs) {
        const tabCount = tabs.length;
        document.getElementById('tab-count').textContent = `Tabs open: ${tabCount}`;
    });

    // Retrieve memory thresholds and memory usage, and update the thermometer
    chrome.storage.local.get(["estimatedMemoryUsageGB", "warningThreshold", "dangerThreshold"], (data) => {
        const { estimatedMemoryUsageGB = 0, warningThreshold = 4, dangerThreshold = 6 } = data;
        updateThermometer(estimatedMemoryUsageGB, warningThreshold, dangerThreshold);
    });
});

function updateThermometer(estimatedMemoryUsageGB, warningThreshold, dangerThreshold) {
    const fill = document.getElementById("thermometer-fill");
    const memoryUsageText = document.getElementById("memory-usage");

    // Corrected string interpolation (using backticks instead of single quotes)
    memoryUsageText.innerText = `Memory Usage: ${estimatedMemoryUsageGB.toFixed(1)} GB`;

    const fillPercentage = Math.min((estimatedMemoryUsageGB / dangerThreshold) * 100, 100);
    fill.style.height = fillPercentage + "%";

    // Set color based on memory usage thresholds
    if (estimatedMemoryUsageGB >= dangerThreshold) {
        fill.style.backgroundColor = "red";
    }
    else if (estimatedMemoryUsageGB >= warningThreshold) {
        fill.style.backgroundColor = "orange";
    }
    else {
        fill.style.backgroundColor = "green";
    }
}
