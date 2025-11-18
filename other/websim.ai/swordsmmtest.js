// SWORD Code Editor - All in one JavaScript file
const swordEditor = `
<div class="code-container" id="codeContainer">
    <div class="sword-text" id="swordText">SWORD</div>
    <textarea id="codeEditor" class="code-editor" placeholder="Code here..."></textarea>
    <div class="buttons-container">
        <button id="runButton">Run</button>
        <button id="attachButton">Attach</button>
    </div>
</div>
`;

// Available files for editing
const files = {
    'script.js': ''
};

// Track attached functions
let attachedFunctions = {};

// Dragging state
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Function to initialize the editor
function initSwordEditor() {
    // Append the editor to the document instead of overwriting
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = swordEditor;
    document.body.appendChild(tempDiv.firstElementChild);

    // Add event listeners after DOM is loaded
    setTimeout(() => {
        const codeEditor = document.getElementById('codeEditor');
        codeEditor.value = '';

        // Setup button listeners
        document.getElementById('runButton').addEventListener('click', saveAndRunCode);
        document.getElementById('attachButton').addEventListener('click', attachFunction);

        // Setup drag functionality
        setupDragging();

        // Override console methods
        overrideConsole();
    }, 100);
}

function setupDragging() {
    const container = document.getElementById('codeContainer');
    const swordText = document.getElementById('swordText');

    swordText.addEventListener('mousedown', startDrag);
    swordText.addEventListener('touchstart', startDrag, { passive: false });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    function startDrag(e) {
        isDragging = true;

        if (e.type === 'touchstart') {
            e.preventDefault();
            const touch = e.touches[0];
            dragOffset.x = touch.clientX - container.offsetLeft;
            dragOffset.y = touch.clientY - container.offsetTop;
        } else {
            dragOffset.x = e.clientX - container.offsetLeft;
            dragOffset.y = e.clientY - container.offsetTop;
        }
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        let clientX, clientY;
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - dragOffset.x;
        const y = clientY - dragOffset.y;

        container.style.left = x + 'px';
        container.style.top = y + 'px';
        container.style.transform = 'none';
    }

    function stopDrag() {
        isDragging = false;
    }
}

function saveAndRunCode() {
    const code = document.getElementById('codeEditor').value;

    try {
        if (Object.keys(attachedFunctions).length > 0) {
            // If there are attached functions, create a wrapper function
            let functionNames = Object.keys(attachedFunctions);
            let wrapperCode = `function executeAttached() {\n${code}\n}`;

            // Add all attached functions
            for (const [name, funcCode] of Object.entries(attachedFunctions)) {
                wrapperCode += funcCode + '\n';
            }

            // Execute the wrapper
            eval(wrapperCode);

            // Run the main execution function
            executeAttached();
        } else {
            // Execute the code directly
            eval(code);
        }

        // Show success message
        showOutput('Code executed successfully!', 'success');

    } catch (error) {
        showOutput('Error: ' + error.message, 'error');
        console.error('Execution error:', error);
    }
}

function attachFunction() {
    const code = document.getElementById('codeEditor').value;

    try {
        // Generate a unique function name
        const functionName = 'attachedFunction_' + Date.now();

        // Create function wrapper
        const functionCode = `function ${functionName}() {\n${code}\n}`;

        // Store the function
        attachedFunctions[functionName] = functionCode;

        // Update files object
        files['script.js'] = Object.values(attachedFunctions).join('\n\n');

        // Show success message
        showOutput(`Function "${functionName}" attached successfully!`, 'success');

        // Clear the editor for new code
        document.getElementById('codeEditor').value = '';

    } catch (error) {
        showOutput('Error attaching function: ' + error.message, 'error');
        console.error('Attach error:', error);
    }
}

function showOutput(message, type) {
    // Clear any previous output
    const existingOutput = document.getElementById('code-output');
    if (existingOutput) {
        existingOutput.remove();
    }

    // Create output container
    const outputDiv = document.createElement('div');
    outputDiv.id = 'code-output';
    outputDiv.style.marginTop = '10px';
    outputDiv.style.padding = '10px';
    outputDiv.style.fontFamily = "'Courier New', monospace";
    outputDiv.style.fontSize = '12px';
    outputDiv.style.maxHeight = '200px';
    outputDiv.style.overflow = 'auto';

    // Style based on type
    if (type === 'error') {
        outputDiv.style.background = 'rgba(74, 26, 26, 0.8)';
        outputDiv.style.border = '1px solid #ff6b6b';
        outputDiv.style.color = '#ff6b6b';
    } else {
        outputDiv.style.background = 'rgba(26, 74, 45, 0.8)';
        outputDiv.style.border = '1px solid #4caf50';
        outputDiv.style.color = '#4caf50';
    }

    outputDiv.textContent = message;
    document.querySelector('.code-container').appendChild(outputDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (document.getElementById('code-output')) {
            document.getElementById('code-output').remove();
        }
    }, 3000);
}

function overrideConsole() {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = function() {
        const args = Array.from(arguments);
        showOutput(args.join(' '), 'success');
        originalConsoleLog.apply(console, arguments);
    };

    console.error = function() {
        const args = Array.from(arguments);
        showOutput(args.join(' '), 'error');
        originalConsoleError.apply(console, arguments);
    };
}

// Start the editor when this script loads
initSwordEditor();
