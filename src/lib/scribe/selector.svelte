<script context="module">
    export function selector(node) {
        let container = node;
        let mouse = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            down: false
        };
        function setMousePosition(ev) {
            mouse.x = ev.x - container.getBoundingClientRect().left;
            mouse.y = ev.y - container.getBoundingClientRect().top;
            if (mouse.down) node.dispatchEvent(new CustomEvent("selchange", { detail: { mouse } }));
        };
        function cleanup(ev) {
            node.dispatchEvent(new CustomEvent("cleanup", { detail: { mouse } }));
            mouse = {
                x: 0,
                y: 0,
                startX: 0,
                startY: 0,
                down: false
            };
        }

        let element = null;    
        container.onmousemove = function (ev) {
            setMousePosition(ev);
            if (element !== null) {
                element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
                element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
                element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
                element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
            }
        }

        container.onclick = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        container.onmousedown = function (ev) {
            mouse.down = true;
            mouse.startX = ev.x - container.getBoundingClientRect().left;
            mouse.startY = ev.y - container.getBoundingClientRect().top;
            mouse.x = mouse.startX;
            mouse.y = mouse.startY;
            node.dispatchEvent(new CustomEvent("selstart", { detail: { mouse } }));
            element = document.createElement('div');
            element.classList.add('drawing');
            element.style.position = 'absolute';
            element.style.border = '1px dashed grey';
            element.style.left = mouse.x + 'px';
            element.style.top = mouse.y + 'px';
            container.appendChild(element);
            container.style.cursor = "crosshair";
        }

        container.onmouseup = function (ev) {
            mouse.down = false;
            if (element !== null) {
                // remove drawings, dispatch events
                container.style.cursor = "default";
                const elements = container.getElementsByClassName("drawing");
                while (elements.length > 0) elements[0].remove();
                element = null;
                if (mouse.startX != mouse.x && mouse.startY != mouse.y) {
                    // mouse moved and rect drawn
                    node.dispatchEvent(new CustomEvent("selend", { detail: { mouse } }));
                } else {
                    cleanup(ev);
                }
            } else {
                cleanup(ev);
            }
        }
        return {
            destroy() {
            }
        };
    }
</script>
