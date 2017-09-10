document.getElementById('lightBoxGallery').onclick = function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event,
            onslide: function (index, slide) {
                self = this;
                var initializeAdditional = function (index, data, klass, self) {
                    var text = self.list[index].getAttribute(data),
                        node = self.container.find(klass);
                    node.empty();
                    if (text) {
                        node[0].appendChild(document.createTextNode(text));
                    }
                };
                initializeAdditional(index, 'data-description', '.description', self);
            }
        },
        links = this.getElementsByTagName('a');
    blueimp.Gallery(links, options);
};