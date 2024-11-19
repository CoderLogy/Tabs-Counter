chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);

let totalMemoryGB = 8;  // Default memory (you can change this based on your actual system info)
let warningThreshold = totalMemoryGB * 0.5;
let dangerThreshold = totalMemoryGB * 0.75;
let tabCount = 0;

// Update tab count and badge text
function updateTabCount() {
    chrome.tabs.query({}, function (tabs) {
        tabCount = tabs.length;
        chrome.action.setBadgeText({ text: tabCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.action.setBadgeTextColor({ color: 'white' });
        updateEstimatedMemory();  // Recalculate memory usage when tab count changes
    });
}

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

    // Estimate memory usage based on tab count
    if (chrome.system && chrome.system.memory) {
        estimatedMemoryUsageGB = tabCount * 0.1;  // Adjust memory usage per tab
    } else {
        estimatedMemoryUsageGB = tabCount * 0.08;  // Fallback estimate per tab
    }

    // Store the values in local storage for persistence
    chrome.storage.local.set({
        tabCount,
        warningThreshold,
        dangerThreshold,
        estimatedMemoryUsageGB
    });
}

// Initialize memory thresholds dynamically based on system memory
dynamicThreshold();

// Initialize tab count and badge text immediately
updateTabCount();
