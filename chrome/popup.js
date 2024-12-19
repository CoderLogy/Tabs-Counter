async function updatePopup() {
    try {
        // Get tab count
        const tabs = await chrome.tabs.query({});
        const tabCount = tabs.length;
        document.getElementById('tab-count').textContent = `Open Tabs: ${tabCount}`;

        // Get system memory info
        chrome.system.memory.getInfo((memoryInfo) => {
            const totalMemoryGB = memoryInfo.capacity / (1024 ** 3);
            const usedMemoryGB = (memoryInfo.capacity - memoryInfo.availableCapacity) / (1024 ** 3);
            const freeMemoryGB = memoryInfo.availableCapacity / (1024 ** 3);
            
            const memoryUsageElement = document.getElementById('memory-usage');
            const fill = document.getElementById('thermometer-fill');

            // Estimate Chrome memory (rough estimate based on typical usage)
            const estimatedChromeMemoryGB = Math.min(tabCount * 0.1, totalMemoryGB * 0.75); // ~100MB per tab average

            memoryUsageElement.innerHTML = `
                Free Memory: ${freeMemoryGB.toFixed(1)} GB<br>
                Used Memory: ${usedMemoryGB.toFixed(1)} GB<br>
                Total Memory: ${totalMemoryGB.toFixed(1)} GB
            `;

            if (fill) {
                // Use system memory usage for thermometer
                const fillPercentage = Math.min((usedMemoryGB / totalMemoryGB) * 100, 100);
                fill.style.height = `${fillPercentage}%`;

                // Update color based on memory usage percentage
                if (fillPercentage > 80) {
                    fill.style.backgroundColor = '#ff4444'; // Red
                } else if (fillPercentage > 60) {
                    fill.style.backgroundColor = '#ffaa33'; // Orange
                } else {
                    fill.style.backgroundColor = '#44cc44'; // Green
                }
            }
        });
    } catch (error) {
        console.error('Error updating popup:', error);
    }
}

// Initial update
document.addEventListener('DOMContentLoaded', updatePopup);

// Update every 2 seconds
setInterval(updatePopup, 2000);
