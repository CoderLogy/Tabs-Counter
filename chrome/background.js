let totalMemoryGB = 8;  // Default memory (you can change this based on your actual system info)
let warningThreshold = totalMemoryGB * 0.5;
let dangerThreshold = totalMemoryGB * 0.75;
let tabCount = 0;

// Update tab count and badge text
function updateTabCount() {
    chrome.tabs.query({}, function (tabs) {
        tabCount = tabs.length;
        updateBadgeAndMemory();
    });
}

// New function to handle badge and memory updates
function updateBadgeAndMemory() {
    // Get real-time memory info
    chrome.system.memory.getInfo((memoryInfo) => {
        const usedMemoryGB = (memoryInfo.capacity - memoryInfo.availableCapacity) / (1024 ** 3);
        
        // Update badge text and color based on memory usage
        chrome.action.setBadgeText({ text: tabCount.toString() });
        
        // Change badge color based on memory usage
        let badgeColor = [0, 128, 0, 255]; // Green by default
        if (usedMemoryGB >= dangerThreshold) {
            badgeColor = [255, 0, 0, 255]; // Red
        } else if (usedMemoryGB >= warningThreshold) {
            badgeColor = [255, 165, 0, 255]; // Orange
        }
        
        chrome.action.setBadgeBackgroundColor({ color: badgeColor });
        chrome.action.setBadgeTextColor({ color: 'white' });

        // Store current state
        chrome.storage.local.set({
            tabCount,
            currentMemoryUsage: usedMemoryGB,
            lastUpdated: new Date().getTime()
        });

        console.log('Current Memory Usage (GB):', usedMemoryGB.toFixed(2));
        console.log('Tab Count:', tabCount);
    });
}

// Set up periodic monitoring (every 5 seconds)
setInterval(updateBadgeAndMemory, 5000);

// Set memory thresholds dynamically based on system memory
function dynamicThreshold() {
    // Using chrome.system.memory.getInfo to get system memory information
    chrome.system.memory.getInfo((memoryInfo) => {
        totalMemoryGB = memoryInfo.capacity / (1024 ** 3);  // Convert bytes to GB
        warningThreshold = totalMemoryGB * 0.5;
        dangerThreshold = totalMemoryGB * 0.75;

        // Debug output to check if thresholds are set correctly
        console.log('Total Memory (GB):', totalMemoryGB);
        console.log('Warning Threshold (GB):', warningThreshold);
        console.log('Danger Threshold (GB):', dangerThreshold);

        // Recalculate memory usage after thresholds are set
        updateEstimatedMemory();
    });
}

// Update the estimated memory usage based on tab count
function updateEstimatedMemory() {
    let estimatedMemoryUsageGB;

    // Estimate memory usage per tab (using an average of 50 MB per tab as a more reasonable estimate)
    const memoryPerTabGB = 40 / 1024;  // 50 MB per tab in GB
    estimatedMemoryUsageGB = tabCount * memoryPerTabGB;

    // Store the values in local storage for persistence
    chrome.storage.local.set({
        tabCount,
        warningThreshold,
        dangerThreshold,
        estimatedMemoryUsageGB
    });

    console.log('Estimated Memory Usage (GB):', estimatedMemoryUsageGB);  // Debugging log
}

// Initialize memory thresholds dynamically based on system memory
dynamicThreshold();

// Initialize tab count and badge text immediately
updateTabCount();

// Event listeners for tab creation and removal
chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);
