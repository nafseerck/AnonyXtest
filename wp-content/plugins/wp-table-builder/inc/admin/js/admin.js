var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var WPTB_ActionsField = function WPTB_ActionsField() {
    var _this = this;

    //this.wptbBorderMarker;
    this.wptbActions;
    if (document.getElementsByClassName('wptb-actions').length != 0) {
        this.wptbActions = document.getElementsByClassName('wptb-actions')[0];
    }

    this.addActionField = function (actionType, thisNode) {
        var body = document.getElementsByTagName('body')[0];

        var actions = document.getElementsByClassName('wptb-actions');
        if (actions.length != 0) {
            var previousNode = actions[0].activeElem;
            if (previousNode) {
                previousNode.classList.remove('wptb-directlyhovered');
            }

            while (actions.length != 0) {
                actions[0].parentNode.removeChild(actions[0]);
            }
        }

        if (actionType == 1) {

            var btnDelete = void 0,
                btnCopy = void 0;

            btnDelete = document.createElement('span'), btnCopy = document.createElement('span'), actions = document.createElement('div');

            actions.classList.add('wptb-actions');
            btnDelete.classList.add('dashicons', 'dashicons-trash', 'wptb-delete-action');
            btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'wptb-duplicate-action');

            actions.appendChild(btnCopy);
            actions.appendChild(btnDelete);

            body.appendChild(actions);

            actions.activeElem = thisNode;

            actions.type = 1;

            btnDelete.onclick = function (event) {
                var act = event.target.parentNode.activeElem,
                    el = act.parentNode;

                if (act && act.className.match(/wptb-element-(.+)-(\d+)/i)) {
                    WPTB_Helper.elementControlsStateDelete(act);
                }

                if (act) {
                    el.removeChild(act);
                }

                if (act && (typeof act === 'undefined' ? 'undefined' : _typeof(act)) === 'object' && act.hasOwnProperty('kind') && act.kind == 'text') {
                    var thisRow = el.parentNode;
                    if (thisRow.classList.contains('wptb-table-head')) {
                        var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');
                        WPTB_Helper.dataTitleColumnSet(table);
                    }
                }

                var wptbActionsField = new WPTB_ActionsField();
                wptbActionsField.actionsRemove();

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };

            btnCopy.onclick = function (event) {
                var copy = void 0,
                    infArr = void 0,
                    type = void 0;
                var activeElement = event.target.parentNode.activeElem;
                var td = activeElement.parentNode;
                infArr = activeElement.className.match(/wptb-element-(.+)-(\d+)/i);
                if (infArr && Array.isArray(infArr)) {
                    type = infArr[1];
                    var data = {};
                    data.kind = type;
                    data.elemProt = activeElement;
                    data.tinyMceClear = true;
                    copy = new WPTB_ElementObject(data);
                    WPTB_Helper.elementControlsStateCopy(activeElement, copy.getDOMElement());
                    //WPTB_Helper.elementStartScript( copy.getDOMElement() );

                    td.insertBefore(copy.getDOMElement(), activeElement.nextSibling);
                } else {
                    copy = {};
                    var elementCopy = activeElement.cloneNode(true);
                    elementCopy.classList.remove('wptb-directlyhovered');

                    copy.getDOMElement = function () {
                        return elementCopy;
                    };

                    applyGenericItemSettings(copy);

                    td.insertBefore(copy.getDOMElement(), activeElement.nextSibling);

                    WPTB_Helper.wptbDocumentEventGenerate('wptb-inner-element:copy', activeElement, copy.getDOMElement());
                }

                WPTB_innerElementSet(copy.getDOMElement());

                var wptbActionsField = new WPTB_ActionsField(1, activeElement);
                wptbActionsField.setParameters(activeElement);

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
            };

            if (thisNode.classList.contains('wptb-ph-element')) {
                var btnMove = void 0;
                btnMove = document.createElement('span');
                btnMove.classList.add("dashicons", "dashicons-move", 'wptb-move-action');
                btnMove.draggable = true;
                actions.appendChild(btnMove);

                btnMove.ondragstart = function (event) {
                    var wptbElementIconsDirectories = 'wptb-element-icons-directories';
                    var tmplIconsDirectories = wp.template(wptbElementIconsDirectories);
                    var data = {};
                    var jsonIconsDirectories = tmplIconsDirectories(data);
                    var IconsDirectories = JSON.parse(jsonIconsDirectories);

                    var dragImages = void 0,
                        actions = event.target.parentNode,
                        activeElem = actions.activeElem,
                        infArr = void 0,
                        type = void 0;
                    infArr = activeElem.className.match(/wptb-element-(.+)-(\d+)/i);
                    if (infArr && Array.isArray(infArr)) {
                        type = infArr[1];
                        activeElem.classList.add('wptb-moving-mode');

                        if (IconsDirectories && (typeof IconsDirectories === 'undefined' ? 'undefined' : _typeof(IconsDirectories)) === 'object' && IconsDirectories[type]) {
                            dragImages = WPTB_Helper.getElementIcon(IconsDirectories[type]);
                        }

                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setDragImage(dragImages, 0, 0);
                        event.dataTransfer.setData('node', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
                        event.dataTransfer.setData('wptb-moving-mode', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
                        event.dataTransfer.setData('wptbElIndic-' + infArr[1], 'wptbElIndic-' + infArr[1]);
                        var act = event.target.parentNode.activeElem;
                        if (act.kind == 'text') {
                            var thisRow = act.parentNode.parentNode;
                            if (thisRow.classList.contains('wptb-table-head')) {
                                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');
                                WPTB_Helper.dataTitleColumnSet(table);
                            }
                        }
                    } else {
                        _this.style.display = 'none';
                        console.log(_this);
                    }

                    _this.actionsHide();
                };

                btnMove.ondragend = function (event) {
                    WPTB_Helper.elementDragEndClear();
                };
            }

            actions.style.display = 'block';

            _this.wptbActions = actions;
        }
    };

    this.setParameters = function (thisNode) {

        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            } else {
                _this.wptbActions = false;
            }
        }

        if (_this.wptbActions && _this.wptbActions.classList.contains('wptb-actions')) {
            _this.wptbActions.style.display = 'block';
        } else {
            return;
        }

        var coordinatesElement = thisNode.getBoundingClientRect();

        var wptbContainer = document.getElementsByClassName('wptb-container')[0];
        var correctTop = function correctTop() {
            var coordinatesElement = thisNode.getBoundingClientRect();
            _this.wptbActions.style.top = parseFloat(coordinatesElement.top) - 15 + 'px';
        };
        wptbContainer.removeEventListener('scroll', correctTop, false);

        _this.wptbActions.style.top = parseFloat(coordinatesElement.top) - 15 + 'px';
        _this.wptbActions.style.left = parseFloat(coordinatesElement.right) - parseFloat(_this.wptbActions.clientWidth) + 1 + 'px';

        _this.wptbActions.style.display = 'block';
        thisNode.classList.add('wptb-directlyhovered');

        wptbContainer.addEventListener('scroll', correctTop, false);
    };

    this.leaveFromField = function (event, node, actionType) {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            } else {
                _this.wptbActions = false;
            }
        }

        if (!_this.wptbActions) {
            return;
        }

        if (event.relatedTarget) {
            if (event.relatedTarget.classList.contains('wptb-actions') || event.relatedTarget.classList.contains('wptb-move-action') || event.relatedTarget.classList.contains('wptb-duplicate-action') || event.relatedTarget.classList.contains('wptb-delete-action')) {
                if (!_this.wptbActions) {
                    _this.wptbActions = document.getElementsByClassName('wptb-actions')[0];
                }
                _this.wptbActions.onmouseleave = function (event) {
                    if (event.relatedTarget != null && (event.relatedTarget.classList.contains('wptb-ph-element') || WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-ph-element')) && event.relatedTarget != _this.wptbActions.activeElem && WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-directlyhovered') != _this.wptbActions.activeElem) {

                        //                        this.wptbActions.style.display = 'none';
                        //                        event.relatedTarget.parentNode.parentNode.classList.remove( 'wptb-directlyhovered' );
                        //
                        //                        let wptbActionsField = new WPTB_ActionsField();
                        //
                        //                        wptbActionsField.addActionField( 1, event.relatedTarget.parentNode.parentNode );
                        //
                        //                        wptbActionsField.setParameters( event.relatedTarget.parentNode.parentNode );
                    } else {}

                    var wptbActionsField = new WPTB_ActionsField();

                    wptbActionsField.leaveFromField(event, event.relatedTarget.parentNode.parentNode);

                    event.target.activeElem.classList.remove('wptb-directlyhovered');
                };

                return;
            }
        }

        node.classList.remove('wptb-directlyhovered');
        _this.wptbActions.style.display = 'none';

        if (event.relatedTarget) {
            if (event.relatedTarget.classList.contains('wptb-ph-element') || WPTB_Helper.findAncestor(event.relatedTarget, 'wptb-ph-element')) {
                _this.addActionField(1, event.relatedTarget.parentNode);

                _this.setParameters(event.relatedTarget.parentNode);
            }
        }
    };

    this.actionsRemove = function () {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            }
        }

        if (_this.wptbActions) {
            _this.wptbActions.parentNode.removeChild(_this.wptbActions);
        }
    };

    this.actionsHide = function () {
        if (!_this.wptbActions) {
            var actions = document.getElementsByClassName('wptb-actions');
            if (actions.length > 0) {
                _this.wptbActions = actions[0];
            }
        }

        if (_this.wptbActions) {
            _this.wptbActions.style.opacity = 0;
        }
    };
};
(function () {
    var WPTB_Builder = function WPTB_Builder() {
        var table_id = WPTB_Helper.detectMode();
        if (table_id) {
            var http = new XMLHttpRequest(),
                urlSet = ajaxurl + "?action=get_table" + '&id=' + table_id;
            http.open('GET', urlSet, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function (d) {
                if (this.readyState == 4 && this.status == 200) {
                    var ans = JSON.parse(http.responseText);
                    document.getElementById('wptb-setup-name').value = ans[0];

                    if (ans[1]) {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                        var wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];
                        wptbTableSetupEl.appendChild(WPTB_Parser(ans[1]));

                        var body = document.getElementsByTagName('body')[0];

                        if (ans[2]) {
                            var elementsSettingTemplateJs = document.createElement('script');
                            elementsSettingTemplateJs.setAttribute('type', 'text/html');
                            elementsSettingTemplateJs.setAttribute('class', 'wptb-element-datas');

                            elementsSettingTemplateJs.innerHTML = ans[2];

                            body.appendChild(elementsSettingTemplateJs);
                        }

                        WPTB_Table();
                        WPTB_LeftPanel();
                        WPTB_Settings();

                        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    } else {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                    }

                    return;
                }
            };
            http.send(null);
        } else {
            document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
        }
        document.counter = new ElementCounters();
        document.select = new MultipleSelect();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
    };

    document.addEventListener('DOMContentLoaded', WPTB_Builder);
})();
var WPTB_Cell = function WPTB_Cell(callback, DOMElement) {

    function highlightRow(td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
        for (var i = 0; i < tds.length; i++) {
            tds[i].classList.remove('wptb-highlighted-row-first', 'wptb-highlighted-row-last', 'wptb-highlighted-row-inner', 'wptb-highlighted-column-first', 'wptb-highlighted-column-last', 'wptb-highlighted-column-inner');
        }
        for (var i = 0; i < columnCount; i++) {

            var classToAdd = i == 0 ? 'wptb-highlighted-row-first' : i == columnCount - 1 ? 'wptb-highlighted-row-last' : 'wptb-highlighted-row-inner';
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    }

    function highlightColumn(td) {

        var index,
            parentRow = td.parentNode;
        columnCount = parseInt(document.getElementById('wptb-columns-number').value), rowCount = parseInt(document.getElementById('wptb-rows-number').value), table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = i == 0 ? 'wptb-highlighted-column-first' : i == rowCount - 1 ? 'wptb-highlighted-column-last' : 'wptb-highlighted-column-inner';
            var tr = table.getElementsByTagName('tr')[i];
            if (tr.getElementsByTagName('td')[index] !== td) {
                tr.getElementsByTagName('td')[index].classList.add(classToAdd);
            }
        }
    }

    if (!DOMElement) {
        DOMElement = document.createElement("td");

        DOMElement.style.padding = jQuery('#wptb-table-padding-number').val() + 'px';

        var innerBorderWidth = jQuery('#wptb-table-inner-border-number').val();

        if (innerBorderWidth != '' && parseInt(innerBorderWidth) != 0) {
            DOMElement.style.border = innerBorderWidth + 'px solid ' + jQuery('#wptb-table-border-color').val();
        }

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');
    }

    DOMElement.draggable = false;
    if (callback) {
        DOMElement.onclick = callback;
    }

    WPTB_innerElementSet(DOMElement);

    var wptbPhElement = DOMElement.getElementsByClassName('wptb-ph-element');

    if (wptbPhElement.length > 0) {
        var _loop = function _loop(i) {
            wptbPhElement[i].getDOMElement = function () {
                return wptbPhElement[i];
            };

            WPTB_innerElementSet(wptbPhElement[i]);

            var wptbElementTypeClass = wptbPhElement[i].className.match(/wptb-element-((.+-)\d+)/i);
            if (wptbElementTypeClass && Array.isArray(wptbElementTypeClass)) {
                (function () {
                    var wptbTypeElementArr = wptbElementTypeClass[1].split('-');
                    wptbPhElement[i].kind = wptbTypeElementArr[0];
                    applyGenericItemSettings(wptbPhElement[i], wptbElementTypeClass[1]);
                    var wptbInternalActiveElement = wptbPhElement[i].getElementsByClassName('wptb-in-element');
                    if (wptbInternalActiveElement.length > 0) {
                        var _loop2 = function _loop2(j) {
                            var wptbInternalActiveElementObj = {};
                            wptbInternalActiveElementObj.getDOMElement = function () {
                                return wptbInternalActiveElement[j];
                            };

                            applyGenericItemSettings(wptbInternalActiveElementObj);
                        };

                        for (var j = 0; j < wptbInternalActiveElement.length; j++) {
                            _loop2(j);
                        }
                    }
                })();
            }
        };

        for (var i = 0; i < wptbPhElement.length; i++) {
            _loop(i);
        }
    }

    this.getDOMElement = function () {
        return DOMElement;
    };

    this.setCoords = function (y, x) {
        var el = this.getDOMElement();
        el.dataset.yIndex = y;
        el.dataset.xIndex = x;
    };

    this.getCoords = function () {
        var coords,
            el = this.getDOMElement();
        coords.x = el.dataset.xIndex;
        coords.y = el.dataset.yIndex;
        return coords;
    };

    this.appendElement = function (node) {
        getDOMElement().appendChild(node);
    };

    DOMElement.getCellDimensions = function () {
        var tdStyleObj = window.getComputedStyle(this, null);

        var tdPaddingLeft = tdStyleObj.getPropertyValue('padding-left');
        var tdPaddingRight = tdStyleObj.getPropertyValue('padding-right');

        var tdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
        var tdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');

        var tdPaddingTop = tdStyleObj.getPropertyValue('padding-top');
        var tdPaddingBottom = tdStyleObj.getPropertyValue('padding-bottom');

        var tdBorderTopWidth = tdStyleObj.getPropertyValue('border-top-width');
        var tdBorderBottomWidth = tdStyleObj.getPropertyValue('border-bottom-width');

        var width = parseFloat(this.offsetWidth, 10) - parseFloat(tdPaddingLeft, 10) - parseFloat(tdPaddingRight, 10) - parseFloat(tdBorderLeftWidth, 10) - parseFloat(tdBorderRightWidth, 10);

        var height = parseFloat(this.offsetHeight, 10) - parseFloat(tdPaddingTop, 10) - parseFloat(tdPaddingBottom, 10) - parseFloat(tdBorderTopWidth, 10) - parseFloat(tdBorderBottomWidth, 10);

        return {
            width: width,
            height: height
        };
    };

    return this;
};
var WPTB_DropHandle = function WPTB_DropHandle(thisElem, e) {

    var wptbDropHandle = void 0,
        wptbDropBorderMarker = void 0;
    if (document.getElementsByClassName('wptb-drop-handle').length == 0) {
        wptbDropHandle = document.createElement('div');
        wptbDropHandle.classList.add('wptb-drop-handle');

        wptbDropBorderMarker = document.createElement('div');
        wptbDropBorderMarker.classList.add('wptb-drop-border-marker');

        var _wptbDropBorderMarkerTop = document.createElement('div'),
            _wptbDropBorderMarkerRight = document.createElement('div'),
            _wptbDropBorderMarkerBottom = document.createElement('div'),
            _wptbDropBorderMarkerLeft = document.createElement('div');

        _wptbDropBorderMarkerTop.classList.add('wptb-drop-border-marker-top');
        _wptbDropBorderMarkerRight.classList.add('wptb-drop-border-marker-right');
        _wptbDropBorderMarkerBottom.classList.add('wptb-drop-border-marker-bottom');
        _wptbDropBorderMarkerLeft.classList.add('wptb-drop-border-marker-left');

        wptbDropBorderMarker.appendChild(_wptbDropBorderMarkerTop);
        wptbDropBorderMarker.appendChild(_wptbDropBorderMarkerRight);
        wptbDropBorderMarker.appendChild(_wptbDropBorderMarkerBottom);
        wptbDropBorderMarker.appendChild(_wptbDropBorderMarkerLeft);

        var body = document.getElementsByTagName('body');
        if (body.length > 0) {
            body[0].appendChild(wptbDropHandle);
            body[0].appendChild(wptbDropBorderMarker);
        }

        wptbDropHandle.ondragenter = function () {};

        wptbDropHandle.ondragover = function (e) {
            e.preventDefault();
        };

        wptbDropHandle.ondragleave = function () {};
        wptbDropHandle.ondrop = function (e) {
            e.preventDefault();
            var element = void 0;

            if (e.dataTransfer.getData('wptbElement')) {
                element = WPTB_Helper.newElementProxy(e.dataTransfer.getData('wptbElement'));
                element = element.getDOMElement();
            } else {
                element = document.getElementsByClassName(e.dataTransfer.getData('node'))[0];
                element.classList.remove('wptb-moving-mode');
                element.classList.remove('wptb-moving-into-same-elem');
                element.wptbMovingMode = 1;
            }

            var td = void 0;
            if (wptbDropHandle.dataset.text == 'Drop Here') {
                thisElem = wptbDropHandle.getDOMParentElement();
                if (thisElem.nodeName.toLowerCase() == 'td') {
                    td = wptbDropHandle.getDOMParentElement();
                    td.appendChild(element);
                }
            } else {
                var innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;

                if (wptbDropHandle.dataset.text == 'Above Element') {
                    td.insertBefore(element, innerElement);
                } else if (wptbDropHandle.dataset.text == 'Below Element') {
                    var innerElementNext = innerElement.nextSibling;
                    td.insertBefore(element, innerElementNext);
                }
            }

            var thisRow = td.parentNode;
            if (thisRow.classList.contains('wptb-table-head')) {
                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');
                WPTB_Helper.dataTitleColumnSet(table);
            }

            // start item javascript if item is new
            var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
            var elemKind = infArr[1];
            if (e.dataTransfer.getData('wptbElement') && (elemKind == 'text' || elemKind == 'button' || elemKind == 'image' || elemKind == 'star_rating' || elemKind == 'list')) {
                //WPTB_Helper.elementStartScript( element );
            }

            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';

            WPTB_innerElementSet(element);
            if (!element.classList.contains('wptb-image-container') || element.wptbMovingMode == 1) {
                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
                element.wptbMovingMode == undefined;
            }
        };
        var wptbContainer = document.querySelector('.wptb-container');
        wptbContainer.onscroll = function () {
            wptbDropHandle.style.display = 'none';
            wptbDropBorderMarker.style.display = 'none';
        };
    } else {
        wptbDropHandle = document.getElementsByClassName('wptb-drop-handle')[0];
        wptbDropBorderMarker = document.getElementsByClassName('wptb-drop-border-marker')[0];
    }
    if (thisElem && thisElem.nodeName.toLowerCase() == 'td' && thisElem.getElementsByClassName('wptb-ph-element').length != 0) {
        return;
    }

    var thisRow = void 0;
    if (thisElem.localName == 'td') {
        thisRow = thisElem.parentNode;
    } else if (thisElem.localName == 'div' && thisElem.classList.contains('wptb-ph-element')) {
        thisRow = thisElem.parentNode.parentNode;
    }
    if (thisRow.classList.contains('wptb-table-head')) {
        var indics = e.dataTransfer.types;
        var notDragEnter = false;
        for (var i = 0; i < indics.length; i++) {
            var infArr = indics[i].match(/wptbelindic-([a-z]+)/i);
            if (infArr && infArr[1] != 'text') {
                notDragEnter = true;
                break;
            }
        }
        if (notDragEnter) {
            return;
        }
    }

    wptbDropHandle.style.width = thisElem.offsetWidth + 'px';
    var height = thisElem.offsetHeight,
        coordinatesElement = thisElem.getBoundingClientRect(),
        left = parseFloat(coordinatesElement.left),
        top = void 0;
    wptbDropHandle.style.left = left + 'px';

    if (e.dataTransfer.types.indexOf('wptb-moving-mode') != -1) {
        var elementDrag = document.getElementsByClassName('wptb-moving-mode')[0];
        if (thisElem == elementDrag) {
            wptbDropHandle.classList.add('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.add('wptb-moving-into-same-elem');
        } else {
            wptbDropHandle.classList.remove('wptb-moving-into-same-elem');
            wptbDropBorderMarker.classList.remove('wptb-moving-into-same-elem');
        }
    }

    wptbDropHandle.getDOMParentElement = function () {
        return thisElem;
    };

    wptbDropHandle.style.display = 'block';
    wptbDropBorderMarker.style.display = 'block';
    if (thisElem.nodeName.toLowerCase() != 'td') {
        var y = e.offsetY == undefined ? e.layerY : e.offsetY;
        top = parseFloat(coordinatesElement.top) - parseFloat(11);
        wptbDropHandle.dataset.text = 'Above Element';
        if (y > height / 2) {
            top = parseFloat(coordinatesElement.top) + height - 1;
            wptbDropHandle.dataset.text = 'Below Element';
        }
    } else {
        wptbDropHandle.dataset.text = 'Drop Here';
        top = parseFloat(coordinatesElement.top) + height / 2 - 5;
    }
    wptbDropHandle.style.top = top + 'px';

    wptbDropBorderMarker.style.top = coordinatesElement.top + 'px';
    wptbDropBorderMarker.style.left = coordinatesElement.left + 'px';

    wptbDropBorderMarkerTop = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-top');
    wptbDropBorderMarkerTop.style.width = parseFloat(thisElem.offsetWidth) - parseFloat(1) + 'px';

    wptbDropBorderMarkerRight = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-right');
    wptbDropBorderMarkerRight.style.height = parseFloat(coordinatesElement.bottom) - parseFloat(coordinatesElement.top) - 1 + 'px';
    wptbDropBorderMarkerRight.style.left = wptbDropBorderMarkerTop.style.width;

    wptbDropBorderMarkerBottom = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-bottom');
    wptbDropBorderMarkerBottom.style.width = wptbDropBorderMarkerTop.style.width;
    wptbDropBorderMarkerBottom.style.top = wptbDropBorderMarkerRight.style.height;

    wptbDropBorderMarkerLeft = wptbDropBorderMarker.querySelector('.wptb-drop-border-marker-left');
    wptbDropBorderMarkerLeft.style.height = wptbDropBorderMarkerRight.style.height;
};
var ElementCounters = function ElementCounters() {

	var priv = [];
	priv['text'] = 0;
	priv['image'] = 0;
	priv['list'] = 0;
	priv['button'] = 0;

	this.increment = function (key) {
		if (!(key in priv)) {
			return;
		}
		priv[key]++;
	};

	this.nextIndex = function (key) {
		if (!(key in priv)) {
			return undefined;
		}
		return priv[key] + 1;
	};

	return this;
};
var WPTB_ElementObject = function WPTB_ElementObject(data) {
    var DOMElement = void 0,
        kindIndexProt = void 0,
        copy = void 0;
    if (!data.elemProt) {
        DOMElement = document.createElement('div'), kindIndexProt = undefined, copy = false;
        DOMElement.classList.add('wptb-' + data.kind + '-container', 'wptb-ph-element', 'wptb-item-javascript-indic');

        var wpTemplateId = 'wptb-' + data.kind + '-content';
        var template = wp.template(wpTemplateId);
        data.node = DOMElement;
        var itemHtml = template(data);

        itemHtml = itemHtml.replace(/\r|\n|\t/g, '').trim();
        DOMElement.innerHTML = itemHtml;
    } else {
        DOMElement = data.elemProt.cloneNode(true);
        DOMElement.classList.remove('wptb-directlyhovered');
        var wptbElementMutch = data.elemProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
        };
        copy = true;

        if (data.tinyMceClear) {
            DOMElement = WPTB_Helper.elementClearFromTinyMce(DOMElement);
        }
    }

    var inElems = DOMElement.querySelectorAll('.wptb-in-element');
    if (inElems.length > 0) {
        var _loop = function _loop(i) {
            var inElemObj = {};
            inElemObj.getDOMElement = function () {
                return inElems[i];
            };

            applyGenericItemSettings(inElemObj);
        };

        for (var i = 0; i < inElems.length; i++) {
            _loop(i);
        }
    }

    window.addEventListener('item:onmouseenter', function (event) {
        //console.log( event );
    }, false);

    this.kind = data.kind;
    this.getDOMElement = function () {
        return DOMElement;
    };

    applyGenericItemSettings(this, kindIndexProt, copy);
    return this;
};
var WPTB_ElementOptions = function WPTB_ElementOptions(element, index, kindIndexProt) {

    var node = element.getDOMElement(),
        elemIdClass;

    node.onclick = function () {
        var children = document.getElementById("element-options-group").childNodes;
        for (var _i = 0; _i < children.length; _i++) {
            if (children[_i].style) children[_i].style.display = 'none';
        }

        var infArr = this.className.match(/wptb-element-((.+-)\d+)/i);
        // get controls config for this item
        var wptbContrlStacksConfigId = 'wptb-' + element.kind + '-control-stack';
        var tmplControlsConfig = wp.template(wptbContrlStacksConfigId);
        var data = {
            container: '.' + infArr[0]
        };
        var jsonControlsConfigJson = tmplControlsConfig(data);
        var jsonControlsConfig = JSON.parse(jsonControlsConfigJson);

        // create a container for inserting controls of this item
        var wptbElementOptionsContainer = document.createElement('div');
        wptbElementOptionsContainer.classList.add('wptb-element-options', 'wptb-options-' + infArr[1]);

        // clear elements from options group
        //document.getElementById( 'element-options-group' ).innerHTML = '';
        var elementOptionsGroup = document.getElementById('element-options-group');
        var elementOptionsGroupChildren = elementOptionsGroup.children;
        for (var _i2 = 0; _i2 < elementOptionsGroupChildren.length; _i2++) {
            var regularText = new RegExp('wptb-options-' + element.kind + '-(\\d+)', "i");
            var elem = elementOptionsGroupChildren[_i2].className.match(regularText);
            if (elem) {
                elementOptionsGroup.removeChild(elementOptionsGroupChildren[_i2]);
            }
        }

        // hide wptb-elements-container and wptb-settings-section
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';

        // show element-options-group 
        document.getElementById("element-options-group").style.display = 'block';

        // insert created container into element-option-group tag
        document.getElementById('element-options-group').appendChild(wptbElementOptionsContainer);

        // show created container
        wptbElementOptionsContainer.style.display = 'block';

        // array for save all scrips for each controls
        var controlScriptsArr = [];

        // array for keep "appear depend on" parametrs
        var controlAppearDependOn = [];

        // create controls
        var i = 0;
        Object.keys(jsonControlsConfig).forEach(function (key) {
            var data = jsonControlsConfig[key];
            data.controlKey = key;

            // get necessary wp js template
            var tmplControlTemplate = wp.template('wptb-' + data.type + '-control');

            data.elemContainer = infArr[0];
            data.elementControlTargetUnicClass = 'wptb-el-' + infArr[1] + '-' + data.controlKey;
            var controlTemplate = tmplControlTemplate(data);

            if ('appearDependOn' in data) {
                if (Array.isArray(data.appearDependOn)) {
                    controlAppearDependOn.push([data.appearDependOn, data.elementControlTargetUnicClass]);
                }
            }

            //console.log( controlTemplate );

            var wptbElementOptionContainer = document.createElement('div');
            wptbElementOptionContainer.classList.add('wptb-element-option', 'wptb-settings-items');

            if (data.customClassForContainer) {
                wptbElementOptionContainer.classList.add(data.customClassForContainer);
            }

            if (data.containerAdditionalStyles) {
                wptbElementOptionContainer.setAttribute('style', data.containerAdditionalStyles);
            }

            wptbElementOptionContainer.innerHTML = controlTemplate;

            wptbElementOptionsContainer.appendChild(wptbElementOptionContainer);

            var helperJavascriptElem = wptbElementOptionContainer.getElementsByTagName('wptb-template-script');
            if (helperJavascriptElem.length > 0) {
                helperJavascriptElem = helperJavascriptElem[0];
                var helperJavascriptCode = helperJavascriptElem.innerText;
                wptbElementOptionContainer.removeChild(helperJavascriptElem);
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.innerHTML = helperJavascriptCode.replace(/\r|\n|\t/g, '').trim();
                controlScriptsArr.push(script);
            }

            i++;
        });

        // run the scripts of controls
        if (controlScriptsArr.length > 0) {
            for (var _i3 = 0; _i3 < controlScriptsArr.length; _i3++) {
                wptbElementOptionsContainer.appendChild(controlScriptsArr[_i3]);
            }
        }

        // run appearDependOn function
        for (var _i4 = 0; _i4 < controlAppearDependOn.length; _i4++) {
            WPTB_Helper.appearDependOn(controlAppearDependOn[_i4][0], controlAppearDependOn[_i4][1]);
        }

        WPTB_Helper.wptbDocumentEventGenerate('controlPanel:added:leftPanel');
    };
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var WPTB_Helper = {
    hexToRgb: function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : null;
    },
    rgbToHex: function rgbToHex(rgb) {
        var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    },
    getElementIcon: function getElementIcon(icon_directory) {
        var hostName = location.protocol + '//' + location.hostname;
        var img = document.createElement('img');
        img.src = icon_directory;
        return img;
    },
    elementDragEndClear: function elementDragEndClear() {
        var wptbMovingMode = document.getElementsByClassName('wptb-moving-mode');
        if (wptbMovingMode.length > 0) {
            for (var i = 0; i < wptbMovingMode.length; i++) {
                wptbMovingMode[i].classList.remove('wptb-moving-mode');
            }
        }

        var wptbDropHandles = document.getElementsByClassName('wptb-drop-handle');
        if (wptbDropHandles.length > 0) {
            for (var _i = 0; _i < wptbDropHandles.length; _i++) {
                wptbDropHandles[_i].style.display = 'none';
            }
        }

        var wptbDropBorderMarkers = document.getElementsByClassName('wptb-drop-border-marker');
        if (wptbDropBorderMarkers.length > 0) {
            for (var _i2 = 0; _i2 < wptbDropBorderMarkers.length; _i2++) {
                wptbDropBorderMarkers[_i2].style.display = 'none';
            }
        }
    },
    linkHttpCheckChange: function linkHttpCheckChange(link) {
        if (link) {
            if (link.indexOf('http://') == -1 && link.indexOf('https://') == -1) {
                var linkArr = link.split('/'),
                    linkClean = void 0;
                if (Array.isArray(linkArr) && linkArr.length > 0) {
                    linkClean = linkArr[linkArr.length - 1];
                }
                return document.location.protocol + '//' + linkClean;
            } else {
                return link;
            }
        } else {
            return '';
        }
    },
    dataTitleColumnSet: function dataTitleColumnSet(table) {
        var rows = table.rows,
            rowHead = rows[0];
        var computedStyleRowHead = getComputedStyle(rowHead);

        var rowHeadChildren = rowHead.children;
        var contentsForHeader = {};
        for (var i = 0; i < rowHeadChildren.length; i++) {
            var tdElements = rowHeadChildren[i].children;
            for (var j = 0; j < tdElements.length; j++) {
                var element = tdElements[j];
                if (element.classList.contains('wptb-ph-element')) {
                    var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
                    if (infArr[1] == 'text') {
                        var p = element.querySelector('p'),
                            textContent = p.textContent,
                            textAlign = p.style.textAlign;
                        contentsForHeader[rowHeadChildren[i].dataset.xIndex] = [textContent, element.style.fontSize, element.style.color, computedStyleRowHead.backgroundColor, textAlign];
                        break;
                    }
                }
            }
            if (!contentsForHeader[rowHeadChildren[i].dataset.xIndex]) {
                contentsForHeader[rowHeadChildren[i].dataset.xIndex] = ['', '', '', computedStyleRowHead.backgroundColor, ''];
            }
        }
        for (var _i3 = 1; _i3 < rows.length; _i3++) {
            var thisRow = rows[_i3],
                thisRowChildren = thisRow.children;
            for (var _j = 0; _j < thisRowChildren.length; _j++) {
                if (contentsForHeader[thisRowChildren[_j].dataset.xIndex]) {
                    thisRowChildren[_j].dataset.wptbTitleColumn = contentsForHeader[thisRowChildren[_j].dataset.xIndex][0];
                    thisRowChildren[_j].dataset.wptbTitleColumnFontSize = contentsForHeader[thisRowChildren[_j].dataset.xIndex][1];
                    thisRowChildren[_j].dataset.wptbTitleColumnColor = contentsForHeader[thisRowChildren[_j].dataset.xIndex][2];
                    thisRowChildren[_j].dataset.wptbTitleBackgroundColor = contentsForHeader[thisRowChildren[_j].dataset.xIndex][3];
                    thisRowChildren[_j].dataset.wptbTitleAlign = contentsForHeader[thisRowChildren[_j].dataset.xIndex][4];
                } else {
                    thisRowChildren[_j].dataset.wptbTitleColumn = '';
                    thisRowChildren[_j].dataset.wptbTitleColumnFontSize = '';
                    thisRowChildren[_j].dataset.wptbTitleColumnColor = '';
                    thisRowChildren[_j].dataset.wptbTitleBackgroundColor = '';
                    thisRowChildren[_j].dataset.wptbTitleAlign = '';
                }
            }
        }
    },
    findAncestor: function findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)) {}
        return el;
    },
    getSelectionText: function getSelectionText() {
        var txt = '';
        if (txt = window.getSelection) {
            txt = window.getSelection().toString();
        } else {
            txt = document.selection.createRange().text;
        }
        return txt;
    },
    settingsPanelClear: function settingsPanelClear() {
        document.getElementById('wptb-adaptive-table-checkbox').checked = false;
        document.getElementById('wptb-top-row-as-header').checked = false;
        document.getElementById('wptb-table-border-slider').value = 0;
        document.getElementById('wptb-table-border-number').value = 0;
        document.getElementById('wptb-inner-border-check').checked = false;
        document.getElementById('wptb-apply-inner-border').classList.remove('visible');
        document.getElementById('wptb-table-inner-border-slider').value = 1;
        document.getElementById('wptb-table-inner-border-number').value = 1;

        WPTB_Helper.wpColorPickerClear('wptb-table-border-color', true);

        WPTB_Helper.wpColorPickerClear('wptb-table-header-bg', true);

        WPTB_Helper.wpColorPickerClear('wptb-even-row-bg', true);

        WPTB_Helper.wpColorPickerClear('wptb-odd-row-bg', true);

        document.getElementById('wptb-table-cell-slider').value = 15;
        document.getElementById('wptb-table-cell-number').value = 15;
    },
    elementOptionsPanelClear: function elementOptionsPanelClear() {
        var elementOptionsGroup = document.getElementById('element-options-group');
        if (elementOptionsGroup) {
            elementOptionsGroup.innerHTML = '';
        }
    },
    wpColorPickerCheckChangeForTableStateSaving: function wpColorPickerCheckChangeForTableStateSaving(event) {
        if (event.originalEvent.type == 'external') {
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        } else {
            var wpPickerContainer = WPTB_Helper.findAncestor(event.target, 'wp-picker-container');
            if (wpPickerContainer) {
                if (event.originalEvent.type == 'square' || event.originalEvent.type == 'strip') {
                    var body = document.getElementsByTagName('body')[0];
                    body.removeEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
                    body.addEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
                }
            }
        }
    },
    irisStripMouseUpStateSaveManager: function irisStripMouseUpStateSaveManager() {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();

        var body = document.getElementsByTagName('body')[0];
        body.removeEventListener('mouseup', WPTB_Helper.irisStripMouseUpStateSaveManager, false);
    },
    wpColorPickerClear: function wpColorPickerClear(attribute, isId) {
        var input = void 0;
        if (isId) {
            input = [document.getElementById(attribute)];
            input.length = 1;
        } else {
            input = document.getElementsByClassName(attribute);
        }
        for (var i = 0; i < input.length; i++) {
            var wpPickerContainer = WPTB_Helper.findAncestor(input[i], 'wp-picker-container');
            if (wpPickerContainer) {
                var parent = wpPickerContainer.parentNode;
                parent.removeChild(wpPickerContainer);
                var newInput = document.createElement('input');
                if (isId) {
                    newInput.setAttribute('id', attribute);
                } else {
                    newInput.classList.add('wptb-element-property', attribute);
                }
                newInput.value = "";
                parent.appendChild(newInput);
            }
        }
    },
    detectMode: function detectMode() {
        var url = window.location.href,
            regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return false;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getColumnWidth: function getColumnWidth(table, cell) {
        var xIndex = cell.dataset.xIndex;
        var xIndexes = table.querySelectorAll('[data-x-index="' + xIndex + '"]');
        var cellWidth = cell.getCellDimensions().width;
        for (var i = 0; i < xIndexes.length; i++) {
            if (cellWidth > xIndexes[i].getCellDimensions().width) {
                cellWidth = xIndexes[i].getCellDimensions().width;
            }
        }
        return cellWidth;
    },
    getRowHeight: function getRowHeight(table, cell) {
        var yIndex = cell.dataset.yIndex;
        var yIndexes = table.querySelectorAll('[data-y-index="' + yIndex + '"]');
        var cellHeight = cell.getCellDimensions().height;
        for (var i = 0; i < yIndexes.length; i++) {
            if (cellHeight > yIndexes[i].getCellDimensions().height) {
                cellHeight = yIndexes[i].getCellDimensions().height;
            }
        }
        return cellHeight;
    },
    newElementProxy: function newElementProxy(el) {
        if (el) {
            var data = { kind: el };
            return new WPTB_ElementObject(data);
        }
    },
    wpColorPickerChange: function wpColorPickerChange(event, ui) {
        var uiColor = void 0;
        if (ui) {
            uiColor = ui.color.toString();
        } else {
            uiColor = '';
        }

        var parent = WPTB_Helper.findAncestor(event.target, 'wp-picker-input-wrap').getElementsByClassName('wptb-color-picker')[0],
            classe = void 0,
            type = void 0,
            ps = void 0,
            number = void 0;
        classe = parent.dataset.element.match(/wptb-options-(.+)-(\d+)/i);
        type = classe[1];
        number = classe[2];
        var affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + number)[0];
        if (type == 'button') {
            if (parent.dataset.type == 'button-text-color') {
                affectedEl.getElementsByClassName('wptb-button')[0].style.color = uiColor;
            } else {
                affectedEl.getElementsByClassName('wptb-button')[0].style.backgroundColor = uiColor;
            }
        } else if (type == 'list') {
            var _ps = affectedEl.querySelectorAll('p');
            if (_ps.length > 0) {
                for (var i = 0; i < _ps.length; i++) {
                    _ps[i].style.color = uiColor;
                }
            }
        } else if (type == 'star_rating') {
            if (parent.dataset.type == 'star-color') {
                var ratingStar = affectedEl.querySelectorAll('li');
                for (var _i4 = 0; _i4 < ratingStar.length; _i4++) {
                    var span = ratingStar[_i4].getElementsByTagName('span');
                    for (var j = 0; j < span.length; j++) {
                        span[j].style.fill = uiColor;
                    }
                }
            } else if (parent.dataset.type == 'numeral-rating-color') {
                var wptbTextMessageSize = affectedEl.querySelector('.wptb-number-rating');
                wptbTextMessageSize.style.color = uiColor;
            }
        } else {
            affectedEl.style.color = uiColor;
        }
    },
    numberImputSize: function numberImputSize(wptbNumberInputs, maxCount, maxValue) {
        wptbNumberInputs.onkeydown = function () {
            var thisValue = this.value;
            thisValue = String(thisValue);
            if (thisValue[0] == 0) {
                this.value = "";
            } else {
                thisValue = thisValue.substring(0, maxCount);
                this.value = thisValue;
            }
        };
        wptbNumberInputs.onkeyup = function () {
            var thisValue = this.value;
            if (parseInt(thisValue, 10) > parseInt(maxValue, 10)) {
                this.value = maxValue;
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        };
    },
    ucfirst: function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    wptbDocumentEventGenerate: function wptbDocumentEventGenerate(eventName, element, details) {
        if (eventName && element) {
            if (!details) {
                details = true;
            }
            var event = new CustomEvent(eventName, { detail: details, bubbles: true });
            element.dispatchEvent(event);
        }
    },
    // run script for the pointed element
    elementStartScript: function elementStartScript(element) {
        //let script = element.getElementsByTagName( 'script' );
        var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
        if (infArr && Array.isArray(infArr)) {
            var kind = infArr[1];
            if (kind) {
                //                let wpTemplateId = 'wptb-' + kind + '-script';
                //                let template = wp.template( wpTemplateId );
                //                let data  = {elemClass: infArr[0]};
                //                let elementScriptText = template( data );
                //                elementScriptText = elementScriptText.replace(/\r|\n|\t/g, '').trim();
                //
                //                let scriptNew = document.createElement( 'script' );
                //                scriptNew.setAttribute( 'type', 'text/javascript' );
                //                scriptNew.innerHTML = elementScriptText;
                //                element.parentNode.appendChild( scriptNew );

                //                element.parentNode.removeChild( scriptNew );
                if (kind in WPTB_ElementsScriptsLauncher) {
                    WPTB_ElementsScriptsLauncher[kind](element);
                }
            }
        }
    },
    // deletes event handlers from the pointed option element and from all his daughter elements
    deleteEventHandlers: function deleteEventHandlers(element) {
        if (element) {
            jQuery(element).off();
            var elementChildren = element.children;
            if (elementChildren) {
                for (var i = 0; i < elementChildren.length; i++) {
                    WPTB_Helper.deleteEventHandlers(elementChildren[i]);
                }
            }
        } else {
            return;
        }
    },
    // replace all occurrences in a string
    replaceAll: function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    },
    // clears code from TinyMCE attributes
    elementClearFromTinyMce: function elementClearFromTinyMce(element) {
        var mceContentBodys = element.querySelectorAll('.mce-content-body');
        if (mceContentBodys.length > 0) {
            for (var k = 0; k < mceContentBodys.length; k++) {
                mceContentBodys[k].classList.remove('mce-content-body');
            }
        }

        var dataMceStyle = element.querySelectorAll('[data-mce-style]');
        if (dataMceStyle.length > 0) {
            for (var _k = 0; _k < dataMceStyle.length; _k++) {
                dataMceStyle[_k].removeAttribute('data-mce-style');
            }
        }

        var mceEditFocus = element.querySelectorAll('.mce-edit-focus');
        if (mceEditFocus.length > 0) {
            for (var _k2 = 0; _k2 < mceEditFocus.length; _k2++) {
                mceEditFocus[_k2].classList.remove('mce-edit-focus');
            }
        }

        var contentEditable = element.querySelectorAll('[contenteditable]');
        if (contentEditable.length > 0) {
            for (var _k3 = 0; _k3 < contentEditable.length; _k3++) {
                contentEditable[_k3].removeAttribute('contenteditable');
            }
        }

        var spellCheck = element.querySelectorAll('[spellcheck]');
        if (spellCheck.length > 0) {
            for (var _k4 = 0; _k4 < spellCheck.length; _k4++) {
                spellCheck[_k4].removeAttribute('spellcheck');
            }
        }

        var mceIds = element.querySelectorAll('[id^=mce_]');
        if (mceIds.length > 0) {
            for (var _k5 = 0; _k5 < mceIds.length; _k5++) {
                mceIds[_k5].removeAttribute('id');
            }
        }

        return element;
    },
    elementOptionContainerCustomClassSet: function elementOptionContainerCustomClassSet(targetInput, customClassForContainer) {
        if (targetInput && customClassForContainer) {
            var containerElement = WPTB_Helper.findAncestor(targetInput, 'wptb-element-option');
            if (containerElement) {
                containerElement.classList.add(customClassForContainer);
            }
        }
    },
    elementOptionContainerAdditionalStyles: function elementOptionContainerAdditionalStyles(targetInput, containerAdditionalStyles) {
        if (targetInput && containerAdditionalStyles) {
            var containerElement = WPTB_Helper.findAncestor(targetInput, 'wptb-element-option');
            var containerStylesArrOne = containerAdditionalStyles.split(';');

            if (containerElement && containerStylesArrOne) {
                var containerStylesSet = function containerStylesSet(containerStyleStr, containerElement) {
                    if (containerStyleStr) {
                        containerStyleStrArr = containerStyleStr.split(':');

                        if (containerStyleStrArr && Array.isArray(containerStyleStrArr)) {
                            containerElement.style[containerStyleStrArr[0]] = containerStyleStrArr[1];
                        }
                    }
                };

                if (containerStylesArrOne && Array.isArray(containerStylesArrOne)) {
                    for (var i = 0; i < containerStylesArrOne.length; i++) {
                        console.log(containerStylesArrOne);
                        if (containerStylesArrOne[i]) {
                            containerStylesSet(containerStylesArrOne[i], containerElement);
                        }
                    }
                } else {
                    containerStylesSet(containerStylesArrOne, containerElement);
                }
            }
        }
    },
    // function which set handler for event of changes of control
    controlsInclude: function controlsInclude(element, functionHandler) {
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function') {
            element.addEventListener('click', function () {
                var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i),
                    elementKind = void 0;

                if (infArr && Array.isArray(infArr)) {
                    elementKind = infArr[1];
                }

                if (!element.hasOwnProperty('сontrolsConnectIndic') || element.сontrolsConnectIndic !== true && elementKind) {
                    var elementsSettingsTemplateJs = document.getElementsByClassName('wptb-element-datas');
                    if (elementsSettingsTemplateJs.length > 0) {
                        (function () {
                            elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                            var elementsSettings = elementsSettingsTemplateJs.innerHTML;
                            var controlClassesNames = [];
                            if (elementsSettings) {
                                elementsSettings = JSON.parse(elementsSettings);
                                if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object') {
                                    if ('tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings) {
                                        var elementSettings = elementsSettings['tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2]];
                                        if (elementSettings && (typeof elementSettings === 'undefined' ? 'undefined' : _typeof(elementSettings)) === 'object') {
                                            Object.keys(elementSettings).forEach(function (key) {
                                                var regularText = new RegExp('data-wptb-el-' + elementKind + '-(\\d+)-(.+)', "i");
                                                var keyInfArr = key.match(regularText);
                                                if (keyInfArr && Array.isArray(keyInfArr)) {
                                                    var controlClass = key.replace('data-', '');
                                                    controlClassesNames.push([controlClass, keyInfArr[2]]);
                                                }
                                            });
                                        }
                                    }
                                }
                            }

                            var _loop = function _loop(i) {
                                element.addEventListener('wptb-control:' + controlClassesNames[i][0], function () {
                                    var controls = {};
                                    var controlName = controlClassesNames[i][1];
                                    var control = document.getElementsByClassName(controlClassesNames[i][0]);
                                    if (control.length > 0 && controlName) {
                                        var targetControlValue = WPTB_Helper.targetControlValueGet(control);

                                        controls[controlName] = targetControlValue;
                                    }

                                    functionHandler(controls, element);
                                }, false);

                                element.сontrolsConnectIndic = true;
                            };

                            for (var i = 0; i < controlClassesNames.length; i++) {
                                _loop(i);
                            }
                        })();
                    }
                }
            }, false);
        }
    },
    oneControlInclude: function oneControlInclude(element, functionHandler, controlName) {
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function' && typeof controlName === 'string') {
            var infArr = element.className.match(/wptb-element-((.+-)\d+)/i),
                elementKind = void 0;

            if (infArr && Array.isArray(infArr)) {
                elementKind = infArr[1].split('-')[0];

                var wptbContrlStacksConfigId = 'wptb-' + elementKind + '-control-stack';
                var tmplControlsConfig = wp.template(wptbContrlStacksConfigId);
                var data = {
                    container: '.' + infArr[0]
                };
                var jsonControlsConfigJson = tmplControlsConfig(data);
                var jsonControlsConfig = JSON.parse(jsonControlsConfigJson);

                if (jsonControlsConfig && (typeof jsonControlsConfig === 'undefined' ? 'undefined' : _typeof(jsonControlsConfig)) === 'object' && jsonControlsConfig.hasOwnProperty(controlName)) {
                    var controlClassName = 'wptb-el-' + infArr[1] + '-' + controlName;

                    element.addEventListener('wptb-control:' + controlClassName, function (event) {
                        var control = document.getElementsByClassName(controlClassName);
                        if (control.length > 0) {
                            var targetControlValue = WPTB_Helper.targetControlValueGet(control);

                            functionHandler(targetControlValue, element);
                        }
                    }, false);
                }
            }
        } else {
            return false;
        }
    },
    //
    innerElementCopyIncludeHandler: function innerElementCopyIncludeHandler(element, functionHandler) {
        if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof functionHandler === 'function') {
            element.addEventListener('wptb-inner-element:copy', function (event) {
                var innerElement = event.detail;
                if (innerElement) {
                    WPTB_Helper.elementClearFromTinyMce(innerElement);
                    functionHandler(innerElement, element);
                }
            }, false);
        }
    },
    //
    appearDependOn: function appearDependOn(dependOn, targetControlElementClass) {
        if (Array.isArray(dependOn)) {
            var dependOnControlName = dependOn[0];
            var infArr = targetControlElementClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

            if (infArr && Array.isArray(infArr)) {
                var controlName = infArr[3];

                var dependOnControlElementClass = targetControlElementClass.replace(controlName, dependOnControlName);

                var dependOnControlElement = document.getElementsByClassName(dependOnControlElementClass);

                if (dependOnControlElement.length > 0) {
                    dependOnControlElement = dependOnControlElement[0];
                    var targetControlElement = document.getElementsByClassName(targetControlElementClass);
                    if (targetControlElement.length > 0) {
                        targetControlElement = targetControlElement[0];
                        var controlContainerElem = WPTB_Helper.findAncestor(targetControlElement, 'wptb-element-option');

                        if (controlContainerElem) {
                            var showHideDependOnControlElement = function showHideDependOnControlElement(dependOnControlElementKind) {

                                var elementsSettingsTemplateJs = document.getElementsByClassName('wptb-element-datas');
                                if (elementsSettingsTemplateJs.length > 0) {
                                    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                                    var elementsSettings = elementsSettingsTemplateJs.innerHTML;
                                    if (elementsSettings) {
                                        elementsSettings = JSON.parse(elementsSettings);
                                        if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object' && 'tmpl-wptb-element-datas-' + dependOnControlElementKind in elementsSettings) {
                                            var elementSettings = elementsSettings['tmpl-wptb-element-datas-' + dependOnControlElementKind];
                                            if (elementSettings && (typeof elementSettings === 'undefined' ? 'undefined' : _typeof(elementSettings)) === 'object' && 'data-wptb-el-' + dependOnControlElementKind + '-' + dependOnControlName in elementSettings) {
                                                var elementSettingValue = elementSettings['data-wptb-el-' + dependOnControlElementKind + '-' + dependOnControlName];

                                                if (elementSettingValue) {
                                                    if (dependOn[1] && Array.isArray(dependOn[1]) && dependOn[1].indexOf(elementSettingValue) !== -1) {
                                                        controlContainerElem.style.display = 'block';
                                                    } else if (dependOn[2] && Array.isArray(dependOn[2]) && dependOn[2].indexOf(elementSettingValue) !== -1) {
                                                        controlContainerElem.style.display = 'none';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };

                            showHideDependOnControlElement(infArr[1]);

                            dependOnControlElement.addEventListener('change', function () {
                                showHideDependOnControlElement(infArr[1]);
                            }, false);
                        }
                    }
                }
            }
        }
    },
    //
    controlsStateManager: function controlsStateManager(targetControlClass, controlChangeIndic) {
        var targetControls = document.getElementsByClassName(targetControlClass);
        if (targetControls.length > 0) {
            //targetControls = targetControls[0];

            var infArr = targetControlClass.match(/wptb-el-((.+-)\d+)-(.+)/i);

            if (infArr && Array.isArray(infArr)) {
                var selectorElement = document.querySelector('.wptb-element-' + infArr[1]);
                if (selectorElement) {
                    var elementsSettingsTemplatesJs = void 0;
                    var elementSettings = {};
                    var elementsSettings = void 0;
                    elementsSettingsTemplatesJs = document.getElementsByClassName('wptb-element-datas');
                    if (elementsSettingsTemplatesJs.length == 0 || elementsSettingsTemplatesJs[0].innerHTML == '') {
                        var targetControlValue = WPTB_Helper.targetControlValueGet(targetControls);
                        elementSettings['data-' + targetControlClass] = targetControlValue;

                        elementsSettings = {};
                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = elementSettings;
                        elementsSettings = JSON.stringify(elementsSettings);

                        if (elementsSettingsTemplatesJs.length == 0) {
                            elementsSettingsTemplatesJs = document.createElement('script');
                            elementsSettingsTemplatesJs.setAttribute('type', 'text/html');
                            elementsSettingsTemplatesJs.setAttribute('class', 'wptb-element-datas');
                        } else {
                            elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        }

                        elementsSettingsTemplatesJs.innerHTML = elementsSettings;

                        var body = document.getElementsByTagName('body')[0];
                        body.appendChild(elementsSettingsTemplatesJs);
                    } else {
                        elementsSettingsTemplatesJs = elementsSettingsTemplatesJs[0];
                        elementsSettings = elementsSettingsTemplatesJs.innerHTML;
                        if (elementsSettings) {
                            elementsSettings = JSON.parse(elementsSettings);

                            if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object') {

                                if (controlChangeIndic) {
                                    var _targetControlValue = WPTB_Helper.targetControlValueGet(targetControls);
                                    if (!('tmpl-wptb-element-datas-' + infArr[1] in elementsSettings) || _typeof(elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]) !== 'object') {
                                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass] = _targetControlValue;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify(elementsSettings);
                                } else if (!('tmpl-wptb-element-datas-' + infArr[1] in elementsSettings && _typeof(elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]) === 'object' && 'data-' + targetControlClass in elementsSettings['tmpl-wptb-element-datas-' + infArr[1]])) {
                                    var _targetControlValue2 = WPTB_Helper.targetControlValueGet(targetControls);
                                    if (!('tmpl-wptb-element-datas-' + infArr[1] in elementsSettings) || _typeof(elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]) !== 'object') {
                                        elementsSettings['tmpl-wptb-element-datas-' + infArr[1]] = {};
                                    }
                                    elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass] = _targetControlValue2;
                                    elementsSettingsTemplatesJs.innerHTML = JSON.stringify(elementsSettings);
                                } else if ('tmpl-wptb-element-datas-' + infArr[1] in elementsSettings && _typeof(elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]) === 'object' && 'data-' + targetControlClass in elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]) {
                                    for (var i = 0; i < targetControls.length; i++) {
                                        if (targetControls[i].type == 'checkbox') {
                                            var _targetControlValue3 = void 0;
                                            if (targetControls[i].name) {
                                                _targetControlValue3 = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass][targetControls[i].name];
                                            } else {
                                                _targetControlValue3 = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass];
                                            }

                                            if (_targetControlValue3 == 'checked') {
                                                targetControls[i].checked = true;
                                            } else if (_targetControlValue3 == 'unchecked') {
                                                targetControls[i].checked = false;
                                            }
                                        } else {
                                            targetControls[i].value = elementsSettings['tmpl-wptb-element-datas-' + infArr[1]]['data-' + targetControlClass];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    targetControlValueGet: function targetControlValueGet(targetControls) {
        var targetControlValue = void 0;
        for (var i = 0; i < targetControls.length; i++) {
            if (targetControls[i].type == 'checkbox' && targetControls[i].name) {
                if (!targetControlValue) targetControlValue = {};
                if (targetControls[i].checked == true) {
                    targetControlValue[targetControls[i].name] = 'checked';
                } else {
                    targetControlValue[targetControls[i].name] = 'unchecked';
                }
            } else if (targetControls[i].type == 'checkbox') {
                if (targetControls[i].checked == true) {
                    targetControlValue = 'checked';
                } else {
                    targetControlValue = 'unchecked';
                }
            } else {
                targetControlValue = targetControls[i].value;
            }
        }
        return targetControlValue;
    },
    //
    elementControlsStateCopy: function elementControlsStateCopy(elementProt, copyElem) {
        if (elementProt && copyElem) {
            var infArrProt = elementProt.className.match(/wptb-element-((.+-)\d+)/i);
            var infArrCopy = copyElem.className.match(/wptb-element-((.+-)\d+)/i);
            if (infArrProt && Array.isArray(infArrProt) && infArrCopy && Array.isArray(infArrCopy)) {
                var elemProtKind = infArrProt[1];
                var elemCopyKind = infArrCopy[1];
                var elementsSettingsTemplateJs = document.getElementsByClassName('wptb-element-datas');
                if (elementsSettingsTemplateJs.length > 0) {
                    elementsSettingsTemplateJs = elementsSettingsTemplateJs[0];

                    var elementsSettings = elementsSettingsTemplateJs.innerHTML;
                    if (elementsSettings) {
                        elementsSettings = JSON.parse(elementsSettings);

                        if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object') {
                            var elementSettingsProt = elementsSettings['tmpl-wptb-element-datas-' + elemProtKind];
                            if (elementSettingsProt && (typeof elementSettingsProt === 'undefined' ? 'undefined' : _typeof(elementSettingsProt)) === 'object') {
                                var elementSettingsCopy = {};

                                Object.keys(elementSettingsProt).forEach(function (key) {
                                    var elementSettingValue = elementSettingsProt[key];
                                    var elementSettingKeyCopy = key.replace(elemProtKind, elemCopyKind);
                                    elementSettingsCopy[elementSettingKeyCopy] = elementSettingValue;
                                });

                                if (Object.keys(elementSettingsCopy).length > 0) {
                                    elementsSettings['tmpl-wptb-element-datas-' + elemCopyKind] = elementSettingsCopy;

                                    elementsSettings = JSON.stringify(elementsSettings);
                                    elementsSettingsTemplateJs.innerHTML = elementsSettings;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    //
    elementControlsStateDelete: function elementControlsStateDelete(element) {
        var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
        var body = document.getElementsByTagName('body')[0];
        var wptbElementDatas = body.getElementsByClassName('wptb-element-datas');
        if (infArr && Array.isArray(infArr) && wptbElementDatas.length > 0) {
            wptbElementDatas = wptbElementDatas[0];
            var elementsSettings = wptbElementDatas.innerHTML;
            if (elementsSettings) {
                elementsSettings = JSON.parse(elementsSettings);
                if (elementsSettings && (typeof elementsSettings === 'undefined' ? 'undefined' : _typeof(elementsSettings)) === 'object' && 'tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2] in elementsSettings) {
                    delete elementsSettings['tmpl-wptb-element-datas-' + infArr[1] + '-' + infArr[2]];

                    if (Object.keys(elementsSettings).length == 0) {
                        body.removeChild(wptbElementDatas);
                    } else {
                        elementsSettings = JSON.stringify(elementsSettings);
                        wptbElementDatas.innerHTML = elementsSettings;
                    }
                }
            }
        }
    }
};
var WPTB_Initializer = function WPTB_Initializer() {

        var MIN_COLUMNS = 1,
            MIN_ROWS = 1,
            MAX_COLUMNS = 30,
            MAX_ROWS = 30;

        var tableGenerator = document.body;
        columnsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[0], columnsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[0], rowsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[1], rowsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[1], columnsInput = document.getElementById('wptb-columns-number'), rowsInput = document.getElementById('wptb-rows-number');

        columnsDecrementButton.onclick = function () {
                if (columnsInput.value > MIN_COLUMNS) {
                        columnsInput.value--;
                }
        };

        columnsIncrementButton.onclick = function () {
                if (columnsInput.value < MAX_COLUMNS) {
                        columnsInput.value++;
                }
        };

        rowsDecrementButton.onclick = function () {
                if (rowsInput.value > MIN_ROWS) {
                        rowsInput.value--;
                }
        };

        rowsIncrementButton.onclick = function () {
                if (rowsInput.value < MAX_ROWS) {
                        rowsInput.value++;
                }
        };

        document.getElementById('wptb-generate-table').onclick = function () {
                var columns = document.getElementById('wptb-columns-number').value,
                    rows = document.getElementById('wptb-rows-number').value;

                WPTB_Table(columns, rows);

                var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                wptbTableStateSaveManager.tableStateSet();
        };
};
var WPTB_LeftPanel = function WPTB_LeftPanel() {

    var table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');

    function wptbTdBgColorSavedSet(inputId, trNumber) {
        if (trNumber > 3) return;
        if (table) {
            var tableRows = table.getElementsByTagName('tr');
            if (tableRows.length > trNumber) {
                var trBackgroundColor = tableRows[trNumber].style.backgroundColor;
                var wptbEvenRowBg = document.getElementById(inputId);
                if (wptbEvenRowBg && trBackgroundColor) {
                    wptbEvenRowBg.value = WPTB_Helper.rgbToHex(trBackgroundColor);
                }
            }
        }
    }

    wptbTdBgColorSavedSet('wptb-even-row-bg', 1);
    jQuery('#wptb-even-row-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var _i = 1; _i < tableRows.length; _i += 2) {
                tableRows[_i].style.backgroundColor = ui.color.toString();
            }
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving(event);
        },
        clear: function clear() {
            var tableRows = table.getElementsByTagName('tr');
            for (var _i2 = 1; _i2 < tableRows.length; _i2 += 2) {
                tableRows[_i2].style.backgroundColor = '';
                var tds = tableRows[_i2].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = '';
                }
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }

    });

    wptbTdBgColorSavedSet('wptb-odd-row-bg', 2);
    jQuery('#wptb-odd-row-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var _i3 = 2; _i3 < tableRows.length; _i3 += 2) {
                tableRows[_i3].style.backgroundColor = ui.color.toString();
            }

            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving(event);
        },
        clear: function clear() {
            var tableRows = table.getElementsByTagName('tr');
            for (var _i4 = 2; _i4 < tableRows.length; _i4 += 2) {
                tableRows[_i4].style.backgroundColor = '';
                var tds = tableRows[_i4].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = '';
                }
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    });

    wptbTdBgColorSavedSet('wptb-table-header-bg', 0);
    jQuery('#wptb-table-header-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableHeader = table.getElementsByTagName('tr')[0];
            tableHeader.style.backgroundColor = ui.color.toString();

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        },
        clear: function clear() {
            var tableHeader = table.getElementsByTagName('tr')[0];
            tableHeader.style.backgroundColor = '';
            var tds = tableHeader.getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].style.backgroundColor = '';
            }

            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving(event);
        }
    });

    function tableAdaptiveForMobile(table) {
        var wptbAdaptiveTableCheckbox = document.getElementById('wptb-adaptive-table-checkbox');
        if (table && table.dataset.wptbAdaptiveTable && table.dataset.wptbAdaptiveTable == "1") {
            wptbAdaptiveTableCheckbox.checked = true;
        } else {
            wptbAdaptiveTableCheckbox.checked = false;
        }
    }
    tableAdaptiveForMobile(table);

    function tableTopRowAsHeadSavedSet(table) {
        var wptbTopRowAsHeader = document.getElementById('wptb-top-row-as-header');

        if (table && table.classList.contains('wptb-table-preview-head')) {
            wptbTopRowAsHeader.checked = true;
        } else {
            wptbTopRowAsHeader.checked = false;
        }
    }
    tableTopRowAsHeadSavedSet(table);

    function tableBorderColorWidthSavedSet() {
        var table = document.getElementsByClassName('wptb-preview-table');
        if (table.length > 0) {
            var tableBorderColor = table[0].style.borderColor;
            if (tableBorderColor) {
                var tableBorderColorInput = document.getElementById('wptb-table-border-color');
                if (tableBorderColorInput) {
                    tableBorderColorInput.value = WPTB_Helper.rgbToHex(tableBorderColor);
                }
            }

            var tableBorderWidth = table[0].style.borderWidth;
            if (tableBorderWidth) {
                var wptbTableBorderWidthSlider = document.getElementById('wptb-table-border-slider'),
                    wptbTableBorderWidthNumber = document.getElementById('wptb-table-border-number');

                if (wptbTableBorderWidthSlider) {
                    wptbTableBorderWidthSlider.value = parseInt(tableBorderWidth);
                }
                if (wptbTableBorderWidthNumber) {
                    wptbTableBorderWidthNumber.value = parseInt(tableBorderWidth);
                }
            }

            var tableTd = table[0].querySelector('td');
            var applyInnerBorder = tableTd.style.borderWidth;
            if (applyInnerBorder) {
                var innerBorderCheckInput = document.getElementById('wptb-inner-border-check');
                var wptbApplyInnerBorder = document.getElementById('wptb-apply-inner-border');
                if (applyInnerBorder && parseInt(applyInnerBorder) > 0) {
                    if (innerBorderCheckInput) {
                        innerBorderCheckInput.checked = true;

                        if (wptbApplyInnerBorder) {
                            wptbApplyInnerBorder.classList.add('visible');
                            var wptbTableInnerBorderSlider = document.getElementById('wptb-table-inner-border-slider');
                            var _wptbTableInnerBorderNumber = document.getElementById('wptb-table-inner-border-number');
                            wptbTableInnerBorderSlider.value = parseInt(applyInnerBorder);
                            _wptbTableInnerBorderNumber.value = parseInt(applyInnerBorder);
                        }
                    }
                } else {
                    innerBorderCheckInput.checked = false;
                }
            }

            if (tableBorderWidth && parseInt(tableBorderWidth) > 0 || applyInnerBorder && parseInt(applyInnerBorder) > 0) {
                document.getElementById('wptb-table-border-color-set-area').style.display = '';
            }
        }
    }

    tableBorderColorWidthSavedSet();

    jQuery('#wptb-table-border-color').wpColorPicker({
        change: function change(event, ui) {
            var tableCells = table.getElementsByTagName('td');
            table.style.border = document.querySelector('#wptb-table-border-number').value + 'px solid ' + ui.color.toString();

            for (var i = 0; i < tableCells.length; i++) {
                var tableInnerborderNumber = document.querySelector('#wptb-table-inner-border-number').value;
                if (document.getElementById('wptb-inner-border-check').checked) {
                    tableCells[i].style.border = (tableInnerborderNumber != 0 ? tableInnerborderNumber : 1) + 'px solid ' + ui.color.toString();
                }
            }
            WPTB_Helper.wpColorPickerCheckChangeForTableStateSaving(event);
        },
        clear: function clear() {
            var tableCells = table.getElementsByTagName('td');
            table.style.borderColor = '';

            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.borderColor = '';
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    });

    function addInnerBorderSize(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.borderWidth = document.querySelector('#wptb-table-inner-border-number').value + 'px';
            tableCells[i].style.borderStyle = 'solid';
        }
    }

    function addCellPadding(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.padding = value + 'px';
        }
    }

    function addInnerBorder(checked) {
        var styles,
            color = document.querySelector('#wptb-table-border-color').value != undefined ? document.querySelector('#wptb-table-border-color').value : 'rgb(0,0,0)';
        if (document.querySelector('#wptb-table-inner-border-slider').value == 0 || document.querySelector('#wptb-table-inner-border-number').value == 0) {
            document.querySelector('#wptb-table-inner-border-slider').value = 1;
            document.querySelector('#wptb-table-inner-border-number').value = 1;
        }
        var width = document.querySelector('#wptb-table-inner-border-slider').value + 'px';
        var wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if (wptbPreviewTable.length > 0) {
            if (checked == 'checked') {
                document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
                var tableCells = wptbPreviewTable[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = width + ' solid ' + color;
                }
                document.getElementById('wptb-apply-inner-border').classList.add('visible');
            } else {
                document.getElementById('wptb-apply-inner-border').classList.remove('visible');
                var tableCells = wptbPreviewTable[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = '0px solid ' + color;
                    tableCells[i].style.border = null;
                }
            }
        }
    }

    function addBorderSize(value) {
        table.style.borderWidth = value + 'px';
        table.style.borderStyle = 'solid';
    }

    function cellPaddingSavedSet() {
        var table = document.getElementsByClassName('wptb-preview-table');

        if (table.length > 0) {
            var td = table[0].querySelector('td');

            if (td) {
                var padding = td.style.padding;

                if (padding) {
                    var wptbTableCellSlider = document.getElementById('wptb-table-cell-slider'),
                        _wptbTableCellNumber = document.getElementById('wptb-table-cell-number');

                    if (wptbTableCellSlider) {
                        wptbTableCellSlider.value = parseInt(padding);
                    }
                    if (_wptbTableCellNumber) {
                        _wptbTableCellNumber.value = parseInt(padding);
                    }
                }
            }
        }
    }

    cellPaddingSavedSet();

    var wptbTableBorderNumber = document.getElementById('wptb-table-border-number');
    WPTB_Helper.numberImputSize(wptbTableBorderNumber, 1, 50);

    var wptbTableInnerBorderNumber = document.getElementById('wptb-table-inner-border-number');
    WPTB_Helper.numberImputSize(wptbTableInnerBorderNumber, 1, 50);

    var wptbTableCellNumber = document.getElementById('wptb-table-cell-number');
    WPTB_Helper.numberImputSize(wptbTableCellNumber, 1, 50);

    //    let wptbTextfontSizeNumber = document.getElementById( 'wptb-size-number' );
    //    WPTB_Helper.numberImputSize( wptbTextfontSizeNumber, 1, 50 );
    //    
    //    let wptbImageWidthNumber = document.getElementById( 'wptb-size-number' );
    //    WPTB_Helper.numberImputSize( wptbImageWidthNumber, 2, 100 );

    var wptbTableColumnWidthNumber = document.getElementById('wptb-table-column-width-number');
    WPTB_Helper.numberImputSize(wptbTableColumnWidthNumber, 2, 500);

    var wptbTableRowHeightNumber = document.getElementById('wptb-table-row-height-number');
    WPTB_Helper.numberImputSize(wptbTableRowHeightNumber, 2, 200);

    document.getElementById('wptb-table-cell-slider').oninput = function () {
        document.getElementById('wptb-table-cell-number').value = this.value;
        addCellPadding(this.value);
        table.tdDefaultWidth();
    };

    document.getElementById('wptb-table-cell-slider').onchange = function () {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-cell-number').onchange = function () {
        document.getElementById('wptb-table-cell-slider').value = this.value;
        addCellPadding(this.value);
        table.tdDefaultWidth();

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-border-slider').oninput = function () {
        document.getElementById('wptb-table-border-number').value = this.value;
        addBorderSize(this.value);
        table.tdDefaultWidth();

        var wptbInnerBorderCheck = document.getElementById('wptb-inner-border-check').checked,
            tableBorderColorSetArea = document.getElementById('wptb-table-border-color-set-area');
        if (this.value == 0 && wptbInnerBorderCheck == false) {
            tableBorderColorSetArea.style.display = 'none';
        } else {
            tableBorderColorSetArea.style.display = '';
        }
    };

    document.getElementById('wptb-table-border-slider').onchange = function () {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-border-number').onchange = function () {
        document.getElementById('wptb-table-border-slider').value = this.value;
        addBorderSize(this.value);
        table.tdDefaultWidth();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-inner-border-slider').oninput = function () {
        document.getElementById('wptb-table-inner-border-number').value = this.value;
        addInnerBorderSize(this.value);
        table.tdDefaultWidth();
    };

    document.getElementById('wptb-table-inner-border-slider').onchange = function () {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-inner-border-number').onchange = function () {
        document.getElementById('wptb-table-inner-border-slider').value = this.value;
        addInnerBorderSize(this.value);
        table.tdDefaultWidth();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-inner-border-check').onchange = function () {
        if (table) {
            var val = this.checked ? 'checked' : 'unchecked';
            addInnerBorder(val);
            var borderWidth = document.getElementById('wptb-table-border-slider').value,
                tableBorderColorSetArea = document.getElementById('wptb-table-border-color-set-area');
            if (val == 'unchecked' && borderWidth == 0) {
                tableBorderColorSetArea.style.display = 'none';
            } else {
                tableBorderColorSetArea.style.display = '';
            }

            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    document.getElementById('wptb-table-column-width-slider').oninput = function () {
        document.getElementById('wptb-table-column-width-number').value = this.value;
        table.addColumnWidth(this.value);
    };

    document.getElementById('wptb-table-column-width-slider').onchange = function () {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-column-width-number').onchange = function () {
        document.getElementById('wptb-table-column-width-slider').value = this.value;
        table.addColumnWidth(this.value);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-column-width-auto-fixed').onchange = function () {
        if (this.checked) {
            var highlighted = table.querySelector('.wptb-highlighted');
            var width = WPTB_Helper.getColumnWidth(table, highlighted);
            table.addColumnWidth(width);
        } else {
            table.addColumnWidth(false, true);
            var _highlighted = table.querySelector('.wptb-highlighted');
            var _width = WPTB_Helper.getColumnWidth(table, _highlighted);
            document.getElementById('wptb-table-column-width-number').value = _width;
            document.getElementById('wptb-table-column-width-slider').value = _width;
        }

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-row-height-slider').oninput = function () {
        document.getElementById('wptb-table-row-height-number').value = this.value;
        table.addRowHeight(this.value);
    };

    document.getElementById('wptb-table-row-height-slider').onchange = function () {
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-row-height-number').onchange = function () {
        document.getElementById('wptb-table-row-height-slider').value = this.value;
        table.addRowHeight(this.value);

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-table-row-height-auto-fixed').onchange = function () {
        if (this.checked) {
            var highlighted = table.querySelector('.wptb-highlighted');
            var height = WPTB_Helper.getRowHeight(table, highlighted);
            table.addRowHeight(height);
        } else {
            table.addRowHeight(false, true);
            var _highlighted2 = table.querySelector('.wptb-highlighted');
            var _height = WPTB_Helper.getRowHeight(table, _highlighted2);
            document.getElementById('wptb-table-row-height-number').value = _height;
            document.getElementById('wptb-table-row-height-slider').value = _height;
        }

        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementById('wptb-adaptive-table-checkbox').onchange = function () {
        if (this.checked) {
            table.dataset.wptbAdaptiveTable = 1;
        } else {
            table.dataset.wptbAdaptiveTable = 0;
        }
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    function createMobileHeadForTable(table, thisEvent) {

        if (thisEvent.checked) {
            WPTB_Helper.dataTitleColumnSet(table);

            table.classList.add('wptb-table-preview-head');
            table.rows[0].classList.add('wptb-table-head');
        } else {
            var rows = table.rows;
            table.classList.remove('wptb-table-preview-head');
            rows[0].classList.remove('wptb-table-head');

            for (var _i5 = 1; _i5 < rows.length; _i5++) {
                var thisRow = rows[_i5],
                    thisRowChildren = thisRow.children;
                for (var j = 0; j < thisRowChildren.length; j++) {
                    thisRowChildren[j].removeAttribute('data-wptb-title-column');
                    thisRowChildren[j].removeAttribute('data-wptb-title-column-font-size');
                    thisRowChildren[j].removeAttribute('data-wptb-title-column-color');
                    thisRowChildren[j].removeAttribute('data-wptb-title-background-color');
                    thisRowChildren[j].removeAttribute('data-wptb-title-align');
                }
            }
        }
    }

    document.getElementById('wptb-top-row-as-header').onchange = function () {
        createMobileHeadForTable(table, this);
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
            e.dataTransfer.setData('wptbElIndic-' + this.dataset.wptbElement, 'wptbElIndic-' + this.dataset.wptbElement);
        };
    }

    if (table) {
        document.getElementById('wptb-activate-cell-management-mode').onclick = table.toggleTableEditMode;
        document.getElementById('wptb-table-edit-mode-close').onclick = table.toggleTableEditMode;
        document.getElementById('wptb-left-scroll-panel-curtain-close').onclick = table.toggleTableEditMode;
        document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
        document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
        document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
        document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
        document.getElementById('wptb-add-end-column').onclick = table.addColumnEnd;
        document.getElementById('wptb-add-start-column').onclick = table.addColumnStart;
        document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
        document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
        document.getElementById('wptb-delete-column').onclick = table.deleteColumn;
        document.getElementById('wptb-delete-row').onclick = table.deleteRow;
        document.getElementById('wptb-merge-cells').onclick = table.mergeCells;
        document.getElementById('wptb-split-cell').onclick = table.splitCell;
    }

    document.querySelector('.wptb-left-panel-extend').onclick = function () {
        var wptbContainer = document.querySelector('.wptb-container');
        if (wptbContainer) {
            if (wptbContainer.classList.contains('collapsed')) {
                wptbContainer.classList.remove('collapsed');
            } else {
                wptbContainer.classList.add('collapsed');
            }
        }
    };

    // this code hides the "element parameters" area 
    // when clicked outside this element and its "tinymce" toolbar 
    var wptbBuilderPanel = document.getElementsByClassName('wptb-builder-panel')[0];
    wptbBuilderPanel.onclick = function (e) {
        if (!e.target.classList.contains('wptb-ph-element') && !WPTB_Helper.findAncestor(e.target, 'wptb-ph-element') && !e.target.classList.contains('wptb-fixed-toolbar') && !WPTB_Helper.findAncestor(e.target, 'wptb-fixed-toolbar')) {
            clickOnFreeSpace();
        }
    };

    var wptbHeader = document.getElementsByClassName('wptb-header');
    if (wptbHeader.length > 0) wptbHeader = wptbHeader[0];
    wptbHeader.onclick = function () {
        clickOnFreeSpace();
    };

    function clickOnFreeSpace() {
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById('element-options-group').style.display = 'none';
        var wpcdFixedToolbar = document.getElementById('wpcd_fixed_toolbar');
        if (wpcdFixedToolbar.hasAttribute('data-toolbar-active-id')) {
            document.getElementById(wpcdFixedToolbar.getAttribute('data-toolbar-active-id')).classList.remove('toolbar-active');
        }
    }
    document.querySelector('.wptb-panel-left').addEventListener('click', function (event) {
        if (event.target.classList.contains('wptb-exit-options')) {
            clickOnFreeSpace();
        }
    });
};
var MultipleSelect = function MultipleSelect() {

	var selectedCells = [],
	    multipleCellMode = false;

	this.activateMultipleSelectMode = function () {
		selectedCells = [];
		var tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
		for (var i = 0; i < tds.length; i++) {
			tds[i].classList.remove('wptb-highlighted');
		}
		multipleCellMode = true;
	};

	this.deactivateMultipleSelectMode = function () {
		multipleCellMode = false;
	};

	this.isActivated = function () {
		return multipleCellMode;
	};

	this.pushSelectedCell = function (cell) {
		if (!multipleCellMode) {
			return;
		}
		selectedCells.push(cell);
		cell.classList.add('wptb-highlighted');
	};

	this.selectedCells = function () {
		return selectedCells;
	};

	this.flushSelectedCells = function () {
		selectedCells = [];
	};

	this.getFirst = function () {
		var minXIndex = 1000,
		    minYIndex = 1000,
		    first;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (minXIndex >= selectedCells[i].dataset.xIndex && minYIndex >= selectedCells[i].dataset.yIndex) {
				first = selectedCells[i];
				minXIndex = selectedCells[i].dataset.xIndex;
				minYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return first;
	};

	this.getLast = function () {
		var maxXIndex = -1,
		    maxYIndex = -1,
		    last;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (maxXIndex <= selectedCells[i].dataset.xIndex && maxYIndex <= selectedCells[i].dataset.yIndex) {
				last = selectedCells[i];
				maxXIndex = selectedCells[i].dataset.xIndex;
				maxYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return last;
	};

	this.removeAllButFirst = function () {
		var td = this.getFirst();
		for (var i = 1; i < selectedCells.length; i++) {
			selectedCells[i].classList.add('wptb-fused-cell-' + td.dataset.xIndex + '-' + td.dataset.yIndex);
		}
	};

	return this;
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Parser = function WPTB_Parser(code) {
    var div = document.createElement('div');
    div.innerHTML = code;

    var table = div.children[0];
    var columnTitleMobile = [].concat(_toConsumableArray(table.querySelectorAll('.wptb-column-title-mobile-container')));

    for (var i = 0; i < columnTitleMobile.length; i++) {
        var parent = columnTitleMobile[i].parentNode;
        parent.removeChild(columnTitleMobile[i]);
    }

    var tds = table.querySelectorAll('td');
    for (var _i = 0; _i < tds.length; _i++) {
        tds[_i].classList.add('wptb-droppable');
        tds[_i].classList.remove('wptb-column-title-mobile-not-elements');
    }

    return table;
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = function () {
        'use strict';

        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop,
                i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }();
}
var WPTB_Settings = function WPTB_Settings() {
    var elems = document.getElementsByClassName('wptb-element');

    for (var i = 0; i < elems.length; i++) {
        elems[i].ondragstart = function (event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('wptbElement', event.target.dataset.wptbElement);
            event.dataTransfer.setData('wptbElIndic-' + event.target.dataset.wptbElement, 'wptbElIndic-' + event.target.dataset.wptbElement);
        };
        elems[i].ondragend = function () {
            WPTB_Helper.elementDragEndClear();
        };
    };

    var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
    var wptbUndo = document.getElementsByClassName('wptb-undo');
    if (wptbUndo.length > 0) {
        wptbUndo = wptbUndo[0];

        wptbUndo.onclick = function (event) {
            if (!this.classList.contains('wptb-undoredo-disabled')) {
                wptbTableStateSaveManager.tableStateGet(this.dataset.wptbUndoredo);
                var wptbUndoRedoContainer = document.getElementsByClassName('wptb-undo-redo-container');
                if (wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function (event) {
                        event.target.onmouseleave = '';
                        WPTB_Table();
                    };
                }
            }
        };
    }

    var wptbRedo = document.getElementsByClassName('wptb-redo');
    if (wptbRedo.length > 0) {
        wptbRedo = wptbRedo[0];

        wptbRedo.onclick = function (event) {
            if (!this.classList.contains('wptb-undoredo-disabled')) {
                wptbTableStateSaveManager.tableStateGet(this.dataset.wptbUndoredo);
                var wptbUndoRedoContainer = document.getElementsByClassName('wptb-undo-redo-container');
                if (wptbUndoRedoContainer.length > 0) {
                    wptbUndoRedoContainer = wptbUndoRedoContainer[0];
                    wptbUndoRedoContainer.onmouseleave = function (event) {
                        event.target.onmouseleave = '';
                        WPTB_Table();
                    };
                }
            }
        };
    }

    var shortcodePopupWindow = document.getElementsByClassName('wptb-popup-window-modal')[0];
    document.getElementsByClassName('wptb-embed-btn')[0].onclick = function () {
        if (!this.classList.contains('wptb-button-disable')) {
            shortcodePopupWindow.classList.add('wptb-popup-show');
        }
    };

    window.onbeforeunload = function (e) {
        var wptbSaveDisabled = document.getElementsByClassName('wptb-save-disabled');
        if (wptbSaveDisabled.length == 0) {
            return true;
        } else {
            return null;
        }
    };

    document.getElementsByClassName('wptb-popup-dark-area')[0].onclick = function () {
        shortcodePopupWindow.classList.remove('wptb-popup-show');
    };

    document.getElementsByClassName('wptb-popup-window-close-icon')[0].onclick = function () {
        shortcodePopupWindow.classList.remove('wptb-popup-show');
    };

    document.getElementsByClassName('wptb-preview-btn')[0].onclick = function (e) {
        if (this.classList.contains('wptb-button-disable')) {
            e.preventDefault();
        }
    };

    document.getElementsByClassName('wptb-save-btn')[0].onclick = function (event) {
        if (!event.target.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == event.target.dataset.wptbTableStateNumberSave) {
            return;
        }
        var bar = document.querySelector('.wptb-edit-bar');
        if (bar && bar.classList.contains('visible')) {
            var table = document.getElementsByClassName('wptb-preview-table')[0];
            table.toggleTableEditMode();
        }

        var http = new XMLHttpRequest(),
            url = (wptb_admin_object ? wptb_admin_object.ajaxurl : ajaxurl) + "?action=save_table",
            t = document.getElementById('wptb-setup-name').value.trim(),
            messagingArea = void 0,
            code = void 0,
            datas = void 0;
        code = document.getElementsByClassName('wptb-preview-table');
        if (code.length > 0) {
            code = WPTB_Stringifier(code[0]);
            code = code.outerHTML;
        } else {
            code = '';
        }

        datas = '';
        var datas_containers = document.getElementsByClassName('wptb-element-datas');

        if (datas_containers.length > 0) {
            if (datas_containers[0].innerHTML) {
                datas = datas_containers[0].innerHTML;
            }
        }

        if (t === '' || code === '') {
            var messagingAreaText = '';
            if (t === '') messagingAreaText += 'You must assign a name to the table before saving it.</br>';
            if (code === '') messagingAreaText += 'Table wasn\'t created';
            messagingArea = document.getElementById('wptb-messaging-area');
            messagingArea.innerHTML = '<div class="wptb-error wptb-message">Error: ' + messagingAreaText + '</div>';
            messagingArea.classList.add('wptb-warning');
            setTimeout(function () {
                messagingArea.removeChild(messagingArea.firstChild);
            }, 4000);
            return;
        }

        var params = {
            title: t,
            content: code,
            elements_datas: datas,
            security_code: wptb_admin_object.security_code
        };
        if ((rs = WPTB_Helper.detectMode()) || (rs = document.wptbId)) {
            params.id = rs;
        }
        params = JSON.stringify(params);

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        http.onreadystatechange = function (action) {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(http.responseText);
                messagingArea = document.getElementById('wptb-messaging-area');

                if (data[0] == 'saved') {
                    document.wptbId = data[1];
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
                    document.getElementsByClassName('wptb-embed-btn')[0].classList.remove('wptb-button-disable');
                    document.getElementById('wptb-embed-shortcode').value = '[wptb id=' + data[1] + ']';
                    var wptbPreviewBtn = document.getElementsByClassName('wptb-preview-btn');
                    if (wptbPreviewBtn.length > 0) {
                        wptbPreviewBtn = wptbPreviewBtn[0];
                        wptbPreviewBtn.classList.remove('wptb-button-disable');
                        var wptbPreviewBtnHref = wptbPreviewBtn.dataset.previewHref;
                        wptbPreviewBtnHref = wptbPreviewBtnHref.replace('empty', data[1]);
                        wptbPreviewBtn.setAttribute('href', wptbPreviewBtnHref);
                    }
                } else if (data[0] == 'edited') {
                    messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully updated.</div>';
                    event.target.dataset.wptbTableStateNumberSave = window.wptbTableStateNumberShow;

                    var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
                    if (wptbSaveBtn.length > 0) {
                        wptbSaveBtn = wptbSaveBtn[0];
                        wptbSaveBtn.classList.add('wptb-save-disabled');
                    }
                } else {
                    messagingArea.innerHTML = '<div class="wptb-error wptb-message">Safety problems</div>';
                }
                messagingArea.classList.add('wptb-success');
                setTimeout(function () {
                    messagingArea.removeChild(messagingArea.firstChild);
                }, 4000);
            }
        };
        http.send(params);
    };
};
var WPTB_Stringifier = function WPTB_Stringifier(codeMain) {
    if (codeMain) {
        var code = codeMain.cloneNode(true);
        code.classList.add('wptb-table-preview-static-indic');
        code.dataset.tableColumns = codeMain.columns;
        code.style.width = null;
        code.style.minWidth = null;
        code.style.maxWidth = null;

        var tds = code.getElementsByTagName('td');
        if (tds.length > 0) {
            for (var i = 0; i < tds.length; i++) {

                if (codeMain.querySelector('wptb-table-preview-head')) {
                    tds[i].removeAttribute('data-x-index');
                }
                tds[i].removeAttribute('data-y-index');
                tds[i].removeAttribute('draggable');
                tds[i].classList.remove('wptb-droppable');
                var innerElements = tds[i].getElementsByClassName('wptb-ph-element');

                if (innerElements.length > 0) {
                    for (var j = 0; j < innerElements.length; j++) {

                        var mceContentBodys = innerElements[j].querySelectorAll('.mce-content-body');
                        if (mceContentBodys.length > 0) {
                            for (var k = 0; k < mceContentBodys.length; k++) {
                                mceContentBodys[k].classList.remove('mce-content-body');
                            }
                        }

                        var dataMceStyle = innerElements[j].querySelectorAll('[data-mce-style]');
                        if (dataMceStyle.length > 0) {
                            for (var _k = 0; _k < dataMceStyle.length; _k++) {
                                dataMceStyle[_k].removeAttribute('data-mce-style');
                            }
                        }

                        var contentEditable = innerElements[j].querySelectorAll('[contenteditable]');
                        if (contentEditable.length > 0) {
                            for (var _k2 = 0; _k2 < contentEditable.length; _k2++) {
                                contentEditable[_k2].removeAttribute('contenteditable');
                            }
                        }

                        var spellCheck = innerElements[j].querySelectorAll('[spellcheck]');
                        if (spellCheck.length > 0) {
                            for (var _k3 = 0; _k3 < spellCheck.length; _k3++) {
                                spellCheck[_k3].removeAttribute('spellcheck');
                            }
                        }

                        var mceIds = innerElements[j].querySelectorAll('[id^=mce_]');
                        if (mceIds.length > 0) {
                            for (var _k4 = 0; _k4 < mceIds.length; _k4++) {
                                mceIds[_k4].removeAttribute('id');
                            }
                        }

                        var wptbActions = innerElements[j].querySelectorAll('.wptb-actions');
                        var wptbActionsLength = wptbActions.length;
                        while (wptbActionsLength > 0) {
                            if (wptbActions[0] && wptbActions[0].parentNode) {
                                wptbActions[0].parentNode.removeChild(wptbActions[0]);
                                wptbActionsLength--;
                            } else {
                                break;
                            }
                        }
                    }
                }

                if (tds[i].hasAttribute('data-wptb-title-column')) {
                    var columnNameDivContainer = document.createElement('div'),
                        columnNameDiv = document.createElement('div');
                    columnNameDivContainer.classList.add('wptb-column-title-mobile-container');
                    columnNameDiv.classList.add('wptb-column-title-mobile');
                    columnNameDiv.dataset.wptbTitleColumn = tds[i].dataset.wptbTitleColumn;
                    columnNameDiv.setAttribute('style', 'font-size:' + tds[i].dataset.wptbTitleColumnFontSize + '; \n\
                        color:' + tds[i].dataset.wptbTitleColumnColor + '; background-color:' + tds[i].dataset.wptbTitleBackgroundColor + '; text-align:' + tds[i].dataset.wptbTitleAlign + ';');
                    columnNameDiv.style.padding = tds[i].style.padding;
                    if (tds[i].children.length == 0) {
                        tds[i].classList.add('wptb-column-title-mobile-not-elements');
                    }
                    columnNameDivContainer.appendChild(columnNameDiv);
                    tds[i].insertBefore(columnNameDivContainer, tds[i].firstChild);
                }
            }
        }

        return code;
    }
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var array = [],
    WPTB_Table = function WPTB_Table(columns, rows) {

    /* The members of the class */
    var settings = document.getElementsByClassName('wptb-settings-items'),
        wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
        table,
        row,
        cell,
        maxAmountOfCells,
        maxAmountOfRows;

    //HERE ARE THE PRIVATE FUNCTIONS
    /*
     * This function toggles buttons visibility in cell edit mode
     * (according to the amount of currently selected cells), and
     * highlights visually the clicked cell if it is not highlighted, or
     * removes highlight if clicked cell is already highlighted. 
     * It too toggles the bits of our abstract representation.
     * @param Event this is the event instance of the click performed over a cell.
     */
    var mark = function mark(event) {
        var rs = this.rowSpan,
            cs = this.colSpan,
            markedCells,
            noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            position = getCoords(this),
            row = position[0],
            column = position[1];
        if (!document.select.isActivated()) {
            return;
        }
        if (this.className.match(/wptb-highlighted/)) {
            this.classList.remove('wptb-highlighted');
            for (var i = 0; i < rs; i++) {
                for (var j = 0; j < cs; j++) {
                    array[row + i][column + j] = 0;
                }
            }
        } else {
            this.classList.add('wptb-highlighted');
            for (var i = 0; i < rs; i++) {
                for (var j = 0; j < cs; j++) {
                    array[row + i][column + j] = 1;
                }
            }
        }

        markedCells = document.getElementsByClassName('wptb-highlighted').length;
        if (markedCells === 0) {
            for (var i = 0; i < multipleCells.length; i++) {
                multipleCells[i].classList.remove('visible');
                multipleCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.add('visible');
                noCells[i].removeAttribute('disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.remove('visible');
                singleCells[i].setAttribute('disabled', 'disabled');
            }
            cellSettings.classList.remove('visible');
        } else if (markedCells === 1) {
            for (var i = 0; i < multipleCells.length; i++) {
                multipleCells[i].classList.remove('visible');
                multipleCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.remove('visible');
                noCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.add('visible');
                singleCells[i].removeAttribute('disabled');
            }
            var cellHighlighted = document.querySelector('.wptb-highlighted');
            if (cellHighlighted) {
                var wptbTableColumnWidthSlider = document.getElementById('wptb-table-column-width-slider');
                var wptbTableColumnWidthNumber = document.getElementById('wptb-table-column-width-number');
                var tableColumnWidthAutoFixedCheckbox = document.getElementById('wptb-table-column-width-auto-fixed');
                var width = cellHighlighted.style.width;
                if (width) {
                    wptbTableColumnWidthSlider.value = parseFloat(width, 10);
                    wptbTableColumnWidthNumber.value = parseFloat(width, 10);
                    tableColumnWidthAutoFixedCheckbox.checked = true;
                } else if (cellHighlighted.dataset.wptbFixedWidth) {
                    wptbTableColumnWidthSlider.value = cellHighlighted.dataset.wptbFixedWidth;
                    wptbTableColumnWidthNumber.value = cellHighlighted.dataset.wptbFixedWidth;
                    tableColumnWidthAutoFixedCheckbox.checked = true;
                } else {
                    var cellWidth = WPTB_Helper.getColumnWidth(table, cellHighlighted);
                    wptbTableColumnWidthSlider.value = cellWidth;
                    wptbTableColumnWidthNumber.value = cellWidth;
                    tableColumnWidthAutoFixedCheckbox.checked = false;
                }

                var wptbTableRowHeightSlider = document.getElementById('wptb-table-row-height-slider');
                var wptbTableRowHeightNumber = document.getElementById('wptb-table-row-height-number');
                var tableRowHeightAutoFixedCheckbox = document.getElementById('wptb-table-row-height-auto-fixed');
                var height = cellHighlighted.style.height;
                if (height) {
                    wptbTableRowHeightSlider.value = parseFloat(height, 10);
                    wptbTableRowHeightNumber.value = parseFloat(height, 10);
                    tableRowHeightAutoFixedCheckbox.checked = true;
                } else if (cellHighlighted.dataset.wptbFixedHeight) {
                    wptbTableRowHeightSlider.value = cellHighlighted.dataset.wptbFixedHeight;
                    wptbTableRowHeightNumber.value = cellHighlighted.dataset.wptbFixedHeight;
                    tableRowHeightAutoFixedCheckbox.checked = true;
                } else {
                    var cellHeight = WPTB_Helper.getRowHeight(table, cellHighlighted);
                    wptbTableRowHeightSlider.value = cellHeight;
                    wptbTableRowHeightNumber.value = cellHeight;
                    tableRowHeightAutoFixedCheckbox.checked = false;
                }
            }
            cellSettings.classList.add('visible');
        } else {
            for (var i = 0; i < multipleCells.length; i++) {
                if (table.isSquare(array)) {
                    multipleCells[i].classList.add('visible');
                    multipleCells[i].removeAttribute('disabled');
                } else {
                    multipleCells[i].classList.remove('visible');
                    multipleCells[i].setAttribute('disabled', 'disabled');
                }
            }
            for (var i = 0; i < noCells.length; i++) {
                noCells[i].classList.remove('visible');
                noCells[i].setAttribute('disabled', 'disabled');
            }
            for (var i = 0; i < singleCells.length; i++) {
                singleCells[i].classList.remove('visible');
                singleCells[i].setAttribute('disabled', 'disabled');
            }
            cellSettings.classList.remove('visible');
        }
    };

    /* 
     * This function fills an array with 1's according to the actual design
     * of HTML table.
     * @returns an array of arrays containing an abstract representation
     * of HTML table.
     * @deprecated
     * */

    var realTimeArray = function realTimeArray() {
        var carried = [],
            tds,
            cols,
            matriz = [];

        for (var i = 0; i < maxAmountOfCells; i++) {
            carried[i] = 0;
        }

        for (var i = 0; i < table.rows.length; i++) {
            cols = [];

            var tds = table.rows[i].getElementsByTagName('td');

            for (items = 0; items < tds.length; items++) {

                for (var k = 0; k < tds[items].colSpan; k++) {
                    cols.push(1);
                }

                if (tds[items].rowSpan > 1) {
                    for (var k = 0; k < tds[items].colSpan; k++) {
                        carried[items + k] = {
                            justAssigned: true,
                            amount: tds[items].rowSpan
                        };
                    }
                }
            }

            for (var k = 0; k < maxAmountOfCells; k++) {
                if (_typeof(carried[k]) == 'object' && carried[k].amount > 0) {
                    carried[k].amount--;
                    if (carried[k].justAssigned) {
                        carried[k].justAssigned = false;
                    } else {
                        cols.push(1);
                    }
                }
            }

            matriz.push(cols);
        }
        return matriz;
    };

    /*
     * This function gets the number and position of cell spaces in current row that are occuped 
     * by upper rowspanned cells.
     * @param number the number of row where we wish to calculate the carried rowspans up to.
     * @return an array with the remaining rowspans in each column.
     */
    var carriedRowspans = function carriedRowspans(row) {
        var carried = [],
            tds,
            cols;

        for (var i = 0; i < maxAmountOfCells; i++) {
            carried[i] = 0;
        }

        if (row == -1) {
            return carried;
        }

        for (var i = 0; i <= row; i++) {
            cellsBuffer = table.rows[i].getElementsByTagName('td');
            cellPointer = 0;

            for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
                stepsToMove = 1;

                if (carried[xPosition]) {
                    carried[xPosition]--;
                } else {
                    celda = cellsBuffer[cellPointer++];
                    if (celda.rowSpan > 1) {
                        for (k = 0; k < celda.colSpan; k++) {
                            carried[xPosition + k] = celda.rowSpan - 1;
                        }
                        stepsToMove = celda.colSpan;
                    } else if (celda.colSpan > 1) {
                        stepsToMove = celda.colSpan;
                    }
                }
            }
        }
        return carried;
    };

    /*
     * A helpful function for showing
     * the abstract table in console.
     * @param Array our abstract table.
     */
    var drawTable = function drawTable(a) {
        var string = 'DRAWING TABLE:\n';
        for (var i = 0; i < a.length; i++) {

            for (var j = 0; j < a[i].length; j++) {
                string += ' ' + a[i][j];
            }
            string += '\n';
        }
        table.isSquare(a);
    };

    /*
     * It resets all the bits of our abstract representation
     * to 0 and removes the highlighting class of all cells.
     */

    var undoSelect = function undoSelect() {
        var noCells = document.getElementsByClassName('wptb-no-cell-action'),
            singleCells = document.getElementsByClassName('wptb-single-action'),
            multipleCells = document.getElementsByClassName('wptb-multiple-select-action'),
            cellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            tds = table.getElementsByClassName('wptb-highlighted');
        while (tds.length) {
            tds[0].classList.remove('wptb-highlighted');
        }
        cellSettings.classList.remove('visible');
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                array[i][j] = 0;
            }
        }
        for (var i = 0; i < multipleCells.length; i++) {
            multipleCells[i].classList.remove('visible');
            multipleCells[i].setAttribute('disabled', 'disabled');
        }
        for (var i = 0; i < noCells.length; i++) {
            noCells[i].classList.add('visible');
            noCells[i].removeAttribute('disabled');
        }
        for (var i = 0; i < singleCells.length; i++) {
            singleCells[i].classList.remove('visible');
            singleCells[i].setAttribute('disabled', 'disabled');
        }
    };

    /*
     * This fills the abstract representation of our table with 
     * zeros, at the start. the max amount of cells is the greatest sum
     * of all colspans for row.
     */

    var fillTableArray = function fillTableArray() {
        var colspansSums = [],
            a = [];

        //calculate max amount of cells inside a row
        for (var i = 0; i < table.rows.length; i++) {
            var cells = table.rows[i].getElementsByTagName('td'),
                colspanSumInRow = 0;
            for (var j = 0; j < cells.length; j++) {
                colspanSumInRow += cells[j].colSpan;
            }
            colspansSums.push(colspanSumInRow);
        }

        maxAmountOfCells = Math.max.apply(null, colspansSums);
        //calculate max rows
        var maxAmountOfRows = table.rows.length;

        // fill with zeros from both values
        for (var i = 0; i < maxAmountOfRows; i++) {
            a[i] = [];
            for (var j = 0; j < maxAmountOfCells; j++) {
                a[i].push(0);
            }
        }
        drawTable(a);
        return a;
    };

    /*
     * This function gets the sum of all colspans in a row.
     * @param number the number of row to be used as reference.
     */
    var getActualPointsInRow = function getActualPointsInRow(row) {
        var tds = table.rows[row].getElementsByTagName('td'),
            points = 0;
        for (var i = 0; i < tds.length; i++) {
            points += tds[i].colSpan;
        }
        return points;
    };

    /*
     * This function gets us the exact coordinates of
     * an exact cell, in a more reliable way than xIndex and yIndex,
     * these last ones were meant to be used for getting the cell trough them.
     * @param DOMElement the cell to get the coordinates.
     */
    var getCoords = function getCoords(search) {
        var skipInCols = [],
            cell;

        for (var i = 0; i < maxAmountOfCells; i++) {
            skipInCols[i] = 0;
        }

        for (var i = 0; i < table.rows.length; i++) {
            var cellsBuffer = table.rows[i].getElementsByTagName('td');
            cellPointer = 0;
            for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
                stepsToMove = 1;

                if (skipInCols[xPosition]) {
                    skipInCols[xPosition]--;
                } else {
                    var td = cellsBuffer[cellPointer++];
                    if (td == search) {
                        return [i, xPosition];
                    }
                    if (td.rowSpan > 1) {
                        for (var _k = 0; _k < td.colSpan; _k++) {
                            skipInCols[xPosition + _k] = td.rowSpan - 1;
                        }
                        stepsToMove = td.colSpan;
                    } else if (td.colSpan > 1) {
                        stepsToMove = td.colSpan;
                    }
                }
            }
        }
    };

    jQuery('#wptb-table-header-bg').val('');
    jQuery('#wptb-even-row-bg').val('');
    jQuery('#wptb-odd-row-bg').val('');
    jQuery('#wptb-table-border-color').val('');
    jQuery('#wptb-table-inner-border-number,#wptb-table-inner-border-slider').val('0');
    jQuery('#wptb-table-border-number,#wptb-table-border-slider').val('0');
    jQuery('#wptb-table-padding-number,#wptb-table-padding-slider').val('15');

    if (columns || rows) {
        //END OF PRIVATE FUNCTIONS
        for (var i = 0; i < settings.length; i++) {
            if (settings[i].id !== 'wptb-apply-inner-border') {
                settings[i].classList.add('visible');
            }
        }

        //Create a HTML Table element.
        table = document.createElement('table');
        table.classList.add('wptb-preview-table');
        table.dataset.reconstraction = 1;
        table.dataset.wptbAdaptiveTable = 1;
        //Add the data rows.
        for (var i = 0; i < rows; i++) {

            row = table.insertRow(-1);
            row.classList.add('wptb-row');

            for (var j = 0; j < columns; j++) {
                cell = new WPTB_Cell(mark);
                cell.setCoords(i, j);
                row.appendChild(cell.getDOMElement());
            }
        }
    } else {
        var wptb_preview_table = document.getElementsByClassName('wptb-preview-table');

        if (wptb_preview_table.length > 0) {
            table = wptb_preview_table[0];

            var cells = table.getElementsByTagName('td');

            if (cells.length > 0) {
                for (var _i = 0; _i < cells.length; _i++) {
                    WPTB_Cell(mark, cells[_i]);
                }
            }
        }
    }

    /*
     * This just toggles visibility of cell edit bar, and toggles 
     * cell selecting mode.
     */

    table.toggleTableEditMode = function () {
        var bar = document.getElementsByClassName('wptb-edit-bar'),
            cellModeBackground = document.getElementById('wptb-cell_mode_background'),
            leftScrollPanelCurtain = document.getElementById('wptb-left-scroll-panel-curtain'),
            leftScrollPanelCellSettings = document.getElementById('wptb-left-scroll-panel-cell-settings'),
            wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if (wptbPreviewTable.length > 0) {
            wptbPreviewTable = wptbPreviewTable[0];
        }

        if (bar.length > 0) {
            for (var _i2 = 0; _i2 < bar.length; _i2++) {
                if (bar[_i2].classList.contains('visible')) {
                    document.select.deactivateMultipleSelectMode();
                    bar[_i2].classList.remove('visible');
                    cellModeBackground.classList.remove('visible');
                    leftScrollPanelCurtain.classList.remove('visible');
                    leftScrollPanelCellSettings.classList.remove('visible');
                    wptbPreviewTable.parentNode.classList.remove('wptb-preview-table-manage-cells');
                    var wptbPreviewTableTds = wptbPreviewTable.getElementsByTagName('td');
                    if (wptbPreviewTableTds.length > 0) {
                        for (var _i3 = 0; _i3 < wptbPreviewTableTds.length; _i3++) {
                            wptbPreviewTableTds[_i3].classList.remove('wptb-highlighted');
                        }
                    }
                } else {
                    document.select.activateMultipleSelectMode();
                    bar[_i2].classList.add('visible');
                    cellModeBackground.classList.add('visible');
                    leftScrollPanelCurtain.classList.add('visible');
                    wptbPreviewTable.parentNode.classList.add('wptb-preview-table-manage-cells');
                }
            }
        }
    };

    /*
     * For assigning to each cell xIndex and y Index attributes,
     * these are the column number and row number of cell in table. 
     */

    table.recalculateIndexes = function (start) {
        var trs = this.getElementsByTagName('tr'),
            tds = void 0,
            maxCols = 0,
            maxColsFull = 0,
            tdsArr = [];
        var wptbTopRowAsHeader = document.getElementById('wptb-top-row-as-header');

        for (var i = 0; i < trs.length; i++) {
            if (i == 0) {
                if (start == undefined) {
                    trs[i].style.backgroundColor = jQuery('#wptb-table-header-bg').val();
                }
                if (wptbTopRowAsHeader.checked) {
                    if (start == undefined) {
                        this.classList.add('wptb-table-preview-head');
                        trs[i].classList.add('wptb-table-head');
                    };
                } else {
                    if (start == undefined) {
                        this.classList.remove('wptb-table-preview-head');
                        trs[i].classList.remove('wptb-table-head');
                    }
                }
            } else {
                if (i % 2 == 0) {
                    if (start == undefined) {
                        trs[i].style.backgroundColor = jQuery('#wptb-odd-row-bg').val();
                    }
                    trs[i].classList.remove('wptb-table-head');
                } else {
                    if (start == undefined) {
                        trs[i].style.backgroundColor = jQuery('#wptb-even-row-bg').val();
                    }
                    trs[i].classList.remove('wptb-table-head');
                }
            }

            tdsArr[i];
            tds = trs[i].getElementsByTagName('td');

            if (tdsArr[i] == undefined) {
                tdsArr[i] = [];
            }

            var jMainIter = 0;
            for (var j = 0; j < tds.length; j++) {
                if (tdsArr[i][j] != undefined) {
                    for (var y = 0; y < 100; y++) {
                        if (tdsArr[i][jMainIter] != undefined) {
                            jMainIter++;
                            continue;
                        }
                        tdsArr[i][jMainIter] = tds[j];
                        tds[j].dataset.xIndex = jMainIter;
                        break;
                    }
                } else {
                    tdsArr[i][j] = tds[j];
                    tds[j].dataset.xIndex = jMainIter;
                }
                tds[j].dataset.yIndex = i;

                if (tds[j].colSpan > 1) {
                    for (var _k2 = 1; _k2 < tds[j].colSpan; _k2++) {
                        jMainIter++;
                        tdsArr[i][jMainIter] = 'tdDummy';
                    }
                }

                if (tds[j].rowSpan > 1) {
                    for (var x = 1; x < tds[j].rowSpan; x++) {
                        if (tdsArr[i + x] == undefined) {
                            tdsArr[i + x] = [];
                        }
                        for (var z = 0; z < tds[j].colSpan; z++) {
                            tdsArr[i + x][jMainIter - tds[j].colSpan + 1 + z] = 'tdDummy';
                        }
                    }
                }
                jMainIter++;
                if (i == 0) {
                    maxColsFull = jMainIter;
                }
            }
            if (j > maxCols) {
                maxCols = j;
            }
        }
        this.columns = maxCols;
        this.maxCols = maxColsFull;
    };

    table.addColumnWidth = function (value, cleaner) {
        var highlighted = table.getElementsByClassName('wptb-highlighted');
        if (highlighted.length > 0) {
            for (var _k3 = 0; _k3 < highlighted.length; _k3++) {
                var dataXIndex = highlighted[_k3].dataset.xIndex;
                if (dataXIndex) {
                    (function () {
                        var tableTdsFor = function tableTdsFor(dataXIndex, colspan) {
                            var tableRows = table.rows;
                            var widthIsSet = false;
                            var arrayTdsFromPreviousRow = [];
                            for (var _i4 = 0; _i4 < tableRows.length; _i4++) {
                                var _row = tableRows[_i4];
                                var tds = _row.children;
                                for (var _j = 0; _j < tds.length; _j++) {
                                    var td = tds[_j];
                                    if (td.dataset.xIndex == dataXIndex) {
                                        if (value) {
                                            if (td.colSpan == colspan) {
                                                td.style.width = value + 'px';
                                                td.removeAttribute('data-wptb-fixed-width');
                                                widthIsSet = true;
                                                var tableColumnWidthAutoFixedCheckbox = document.getElementById('wptb-table-column-width-auto-fixed');
                                                if (!tableColumnWidthAutoFixedCheckbox.checked) {
                                                    tableColumnWidthAutoFixedCheckbox.checked = true;
                                                }
                                            } else {
                                                td.style.width = null;
                                                td.dataset.wptbFixedWidth = value;
                                                if (_i4 == tableRows.length - 1 && !widthIsSet) {
                                                    tableTdsFor(dataXIndex, colspan + 1);
                                                }
                                            }
                                        } else if (cleaner) {
                                            td.style.width = null;
                                            td.removeAttribute('data-wptb-fixed-width');
                                        } else {
                                            if (td.dataset.wptbFixedWidth) {
                                                if (td.colSpan == colspan) {
                                                    td.style.width = td.dataset.wptbFixedWidth + 'px';
                                                    td.removeAttribute('data-wptb-fixed-width');
                                                }
                                            } else if (td.style.width) {
                                                for (var z = 0; z < arrayTdsFromPreviousRow.length; z++) {
                                                    arrayTdsFromPreviousRow[z].style.width = td.style.width;
                                                }
                                                arrayTdsFromPreviousRow = [];
                                            } else {
                                                arrayTdsFromPreviousRow.push(td);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        };

                        tableTdsFor(dataXIndex, 1);
                    })();
                }
            }

            table.tdDefaultWidth();
        }
    };

    table.tdDefaultWidth = function () {
        var rows = table.rows;

        var tableTdsSumMaxWidth = 0;
        var tableTdsSumMaxWidthFixed = 0;
        var tableTdsSumMaxWidthAuto = 0;

        var wptbTableSetup = document.getElementsByClassName('wptb-table-setup')[0];
        var wptbTableSetupWidth = wptbTableSetup.offsetWidth;

        var arrayCellsWidthFixedHelper = [];
        var arrayCellsWidthAutoHelper = [];
        var tdPaddingCommon = 0;
        var tableTdBorderCommonWidth = 0;
        var cssForTdsWidthAuto = '';

        for (var _i5 = 0; _i5 < rows.length; _i5++) {
            var tds = rows[_i5].children;
            for (var _j2 = 0; _j2 < tds.length; _j2++) {
                var td = tds[_j2];

                if (!arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)] && !arrayCellsWidthAutoHelper[parseInt(td.dataset.xIndex)]) {
                    if (td.style.width) {
                        arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)] = parseFloat(td.style.width);
                        td.removeAttribute('data-wptb-css-td-auto-width');
                    } else {
                        if (!td.dataset.wptbFixedWidth) {
                            arrayCellsWidthAutoHelper[parseInt(td.dataset.xIndex)] = 100;
                            td.dataset.wptbCssTdAutoWidth = true;
                        }
                    }

                    if (window.getComputedStyle(td, null)) {
                        var tdStyleObj = window.getComputedStyle(td, null);
                        var tdPaddingLeft = tdStyleObj.getPropertyValue('padding-left');
                        var tdPaddingRight = tdStyleObj.getPropertyValue('padding-right');
                        tdPaddingCommon = parseFloat(tdPaddingLeft, 10) + parseFloat(tdPaddingRight, 10);

                        var tableTdBorderLeftWidth = tdStyleObj.getPropertyValue('border-left-width');
                        var tableTdBorderRightWidth = tdStyleObj.getPropertyValue('border-right-width');
                        tableTdBorderCommonWidth = parseFloat(tableTdBorderLeftWidth, 10) + parseFloat(tableTdBorderRightWidth, 10);
                        if (arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)]) {
                            arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)] += tdPaddingCommon;
                            arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)] += tableTdBorderCommonWidth;
                        } else {
                            arrayCellsWidthAutoHelper[parseInt(td.dataset.xIndex)] += tdPaddingCommon;
                            arrayCellsWidthAutoHelper[parseInt(td.dataset.xIndex)] += tableTdBorderCommonWidth;
                        }
                    }
                } else if (arrayCellsWidthAutoHelper[parseInt(td.dataset.xIndex)]) {
                    if (!td.dataset.wptbFixedWidth) {
                        td.dataset.wptbCssTdAutoWidth = true;
                    }
                } else if (arrayCellsWidthFixedHelper[parseInt(td.dataset.xIndex)]) {
                    td.removeAttribute('data-wptb-css-td-auto-width');
                }
            }
        }

        for (var _i6 = 0; _i6 < arrayCellsWidthFixedHelper.length; _i6++) {
            if (arrayCellsWidthFixedHelper[_i6]) {
                tableTdsSumMaxWidthFixed += arrayCellsWidthFixedHelper[_i6];
            }
        }

        var CellsWidthAutoCount = 0;
        for (var _i7 = 0; _i7 < arrayCellsWidthAutoHelper.length; _i7++) {
            if (arrayCellsWidthAutoHelper[_i7]) {
                tableTdsSumMaxWidthAuto += arrayCellsWidthAutoHelper[_i7];
                CellsWidthAutoCount++;
            }
        }

        var tableFullStyleObj = window.getComputedStyle(table, null);
        var borderLeftWidth = tableFullStyleObj.getPropertyValue('border-left-width');
        var borderRightWidth = tableFullStyleObj.getPropertyValue('border-right-width');
        var tableBorderCommon = parseFloat(borderLeftWidth, 10) + parseFloat(borderRightWidth, 10);
        tableTdsSumMaxWidth = tableTdsSumMaxWidthFixed + tableTdsSumMaxWidthAuto + tableBorderCommon;

        table.dataset.wptbTableTdsSumMaxWidth = tableTdsSumMaxWidth;
        if (CellsWidthAutoCount) {
            table.dataset.wptbCellsWidthAutoCount = CellsWidthAutoCount;
            if (table.mergingСellsHorizontally) {
                table.dataset.wptbFixedWidthSize = tableTdsSumMaxWidthFixed - tableBorderCommon;
            } else {
                table.removeAttribute('data-wptb-fixed-width-size');
            }
        } else {
            table.removeAttribute('data-wptb-fixed-width-size');
            table.removeAttribute('data-wptb-cells-width-auto-count');
        }

        var styleElementCreate = false;
        var tableTdWidthAuto = void 0;
        if (tableTdsSumMaxWidth < wptbTableSetupWidth) {
            if (CellsWidthAutoCount) {
                table.style.minWidth = '100%';
                if (table.mergingСellsHorizontally) {
                    table.style.width = null;
                    var tableTdsWidthAutoCommon = wptbTableSetupWidth - tableTdsSumMaxWidthFixed - tableBorderCommon;
                    tableTdWidthAuto = tableTdsWidthAutoCommon / CellsWidthAutoCount;
                    tableTdWidthAuto = tableTdWidthAuto - tdPaddingCommon - tableTdBorderCommonWidth;
                    styleElementCreate = true;
                } else {
                    table.style.width = '100%';
                }
            } else {
                table.style.width = null;
                table.style.minWidth = null;
                table.style.maxWidth = tableTdsSumMaxWidth + 'px';
            }
        } else {
            table.style.maxWidth = null;
            table.style.minWidth = tableTdsSumMaxWidth + 'px';
            table.style.width = null;
            tableTdWidthAuto = '100';
            styleElementCreate = true;
        }

        var head = document.head;
        if (head) {
            var cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width="true"]');
            if (cssForTdsWidthAutoOld) {
                head.removeChild(cssForTdsWidthAutoOld);
            }
        }

        if (styleElementCreate) {
            cssForTdsWidthAuto = document.createElement('style');
            cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width', true);
            cssForTdsWidthAuto.innerHTML = '[data-wptb-css-td-auto-width=true]{width:' + tableTdWidthAuto + 'px}';
            if (head) {
                head.appendChild(cssForTdsWidthAuto);
            }
        }
    };

    table.addRowHeight = function (value, cleaner) {
        var highlighted = table.getElementsByClassName('wptb-highlighted');
        if (highlighted.length > 0) {
            for (var _k4 = 0; _k4 < highlighted.length; _k4++) {
                var dataYIndex = highlighted[_k4].dataset.yIndex;
                if (dataYIndex) {
                    (function () {
                        var tableTdsFor = function tableTdsFor(dataYIndex, rowspan) {
                            var tableRows = table.rows;
                            var heightIsSet = false;
                            var arrayTdsPrevious = [];
                            for (var _i8 = 0; _i8 < tableRows.length; _i8++) {
                                var _row2 = tableRows[_i8];
                                var tds = _row2.children;
                                for (var _j3 = 0; _j3 < tds.length; _j3++) {
                                    var td = tds[_j3];
                                    if (td.dataset.yIndex == dataYIndex) {
                                        if (value) {
                                            if (td.rowSpan == rowspan) {
                                                td.style.height = value + 'px';
                                                td.removeAttribute('data-wptb-fixed-heidht');
                                                heightIsSet = true;
                                                var tableColumnHeightAutoFixedCheckbox = document.getElementById('wptb-table-row-height-auto-fixed');
                                                if (!tableColumnHeightAutoFixedCheckbox.checked) {
                                                    tableColumnHeightAutoFixedCheckbox.checked = true;
                                                }
                                                continue;
                                            } else {
                                                td.style.height = null;
                                                td.dataset.wptbFixedHeight = value;
                                                if (_j3 == tds.length - 1 && !heightIsSet) {
                                                    tableTdsFor(dataYIndex, rowspan + 1);
                                                }
                                            }
                                        } else if (cleaner) {
                                            td.style.height = null;
                                            td.removeAttribute('data-wptb-fixed-heidht');
                                        } else {
                                            if (td.dataset.wptbFixedHeight) {
                                                if (td.rowSpan = rowspan) {
                                                    td.style.height = td.dataset.wptbFixedHeight + 'px';
                                                    td.removeAttribute('data-wptb-fixed-width');
                                                }
                                            } else if (td.style.height) {
                                                for (var z = 0; z < arrayTdsPrevious.length; z++) {
                                                    arrayTdsPrevious[z].style.height = td.style.height;
                                                }
                                                arrayTdsPrevious = [];
                                            } else {
                                                arrayTdsPrevious.push(td);
                                            }
                                        }
                                    }
                                }
                            }
                        };

                        tableTdsFor(dataYIndex, 1);
                    })();
                }
            }
        }
    };

    table.reconstraction = function () {
        var tds = table.getElementsByTagName('td');
        var wptbAdaptiveTableChoseBlock = document.getElementsByClassName('wptb-adaptive-table-chose-block');
        if (wptbAdaptiveTableChoseBlock.length > 0) {
            wptbAdaptiveTableChoseBlock = wptbAdaptiveTableChoseBlock[0];
        }
        table.mergingСellsHorizontally = false;
        table.mergingCellsVertically = false;
        table.dataset.reconstraction = 1;
        wptbAdaptiveTableChoseBlock.style.display = 'block';
        var forBreak = 0;
        for (var _i9 = 0; _i9 < tds.length; _i9++) {
            if (tds[_i9].colSpan > 1) {
                table.dataset.reconstraction = 0;
                wptbAdaptiveTableChoseBlock.style.display = 'none';
                table.mergingСellsHorizontally = true;
                forBreak++;
            }

            if (tds[_i9].rowSpan > 1) {
                table.dataset.reconstraction = 0;
                wptbAdaptiveTableChoseBlock.style.display = 'none';
                table.mergingCellsVertically = true;
                forBreak++;
            }

            if (forBreak == 2) {
                break;
            }
        }
    };

    /*
     * As simple as it is: adds a column to the end of table.
     */
    table.addColumnEnd = function () {
        var td = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
        if (currentTable.length > 0) {
            currentTableTd = currentTable[0].querySelector('td');
        }

        if (currentTableTd) {
            currentTdStyle = currentTableTd.getAttribute('style');
        }

        for (var i = 0; i < table.rows.length; i++) {
            td = new WPTB_Cell(mark);

            if (currentTdStyle) {
                td.getDOMElement().setAttribute('style', currentTdStyle);
                td.getDOMElement().style.width = null;
                td.getDOMElement().style.height = null;
            }

            table.rows[i].appendChild(td.getDOMElement());
            array[i].push(0);
        }

        maxAmountOfCells++;
        table.recalculateIndexes();
        table.tdDefaultWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * As simple as it looks: adds a column to the start of table.
     */

    table.addColumnStart = function () {
        var td = void 0,
            firstCell = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
        if (currentTable.length > 0) {
            currentTableTd = currentTable[0].querySelector('td');
        }

        if (currentTableTd) {
            currentTdStyle = currentTableTd.getAttribute('style');
        }

        for (var i = 0; i < table.rows.length; i++) {
            td = new WPTB_Cell(mark);
            if (currentTdStyle) {
                td.getDOMElement().setAttribute('style', currentTdStyle);
                td.getDOMElement().style.width = null;
                td.getDOMElement().style.height = null;
            }
            firstCell = table.rows[i].getElementsByTagName('td')[0];
            if (firstCell) {
                table.rows[i].insertBefore(td.getDOMElement(), firstCell);
            } else {
                table.rows[i].appendChild(td.getDOMElement());
            }
            array[i].push(0);
        }

        maxAmountOfCells++;
        table.recalculateIndexes();
        table.tdDefaultWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * Well, not so simple as previous functions.
     * It adds a column after a certain column of reference.
     * @param integer the column number to be used as reference.
     *	If empty, then the first highlighted cell is used as reference.
     */

    table.addColumnAfter = function (c_pos) {
        var rows = table.rows,
            cellPointer = void 0,
            cellsBuffer = void 0,
            cell = document.querySelector('.wptb-highlighted'),
            cellStyle = cell.getAttribute('style'),
            pos = c_pos != undefined && typeof c_pos === 'number' ? c_pos : getCoords(cell)[1];

        if (maxAmountOfCells - pos - cell.colSpan + 1 == 1) {
            table.addColumnEnd();
        } else {
            var pendingInsertion = false,
                _stepsToMove = void 0,
                td = void 0,
                bro = void 0,
                _carriedRowspans = [],
                currentCell = void 0;

            for (var i = 0; i < maxAmountOfCells; i++) {
                _carriedRowspans.push(0);
            }

            for (var i = 0; i < rows.length; i++) {
                cellPointer = 0;
                cellsBuffer = rows[i].getElementsByTagName('td');
                pendingInsertion = false;
                for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += _stepsToMove) {
                    _stepsToMove = 1;

                    if (pendingInsertion) {
                        td = new WPTB_Cell(mark);
                        if (cellStyle) {
                            td.getDOMElement().setAttribute('style', cellStyle);
                            td.getDOMElement().style.width = null;
                            td.getDOMElement().style.height = null;
                        }
                        if (currentCell && rows[i].contains(currentCell)) {
                            bro = currentCell.nextSibling;
                            if (bro) {
                                rows[i].insertBefore(td.getDOMElement(), bro);
                            } else {
                                rows[i].appendChild(td.getDOMElement());
                            }
                        } else {
                            rows[i].insertBefore(td.getDOMElement(), cellsBuffer[0]);
                        }
                        break;
                    } else if (_carriedRowspans[xPosition] > 0) {
                        // If no pending insertion, let's check if no rowspan from upper cells is pending in current position
                        if (pos == xPosition) {
                            pendingInsertion = true;
                        }
                    } else {
                        currentCell = cellsBuffer[cellPointer++];
                        if (currentCell.rowSpan > 1) {
                            _stepsToMove = currentCell.colSpan;
                            for (var k = 0; k < currentCell.colSpan; k++) {
                                _carriedRowspans[xPosition + k] = currentCell.rowSpan;
                                if (xPosition + k == pos) {
                                    pendingInsertion = true;
                                }
                            }
                        } else if (currentCell.colSpan > 1) {
                            _stepsToMove = currentCell.colSpan;
                            for (var k = 0; k < currentCell.colSpan; k++) {
                                if (xPosition + k == pos) {
                                    pendingInsertion = true;
                                }
                            }
                        } else if (xPosition == pos) {
                            pendingInsertion = true;
                        }
                    }
                }

                for (var l = 0; l < maxAmountOfCells; l++) {
                    if (_carriedRowspans[l] > 0) _carriedRowspans[l]--;
                }
            }

            for (var i = 0; i < array.length; i++) {
                array[i].push(0);
            }
            maxAmountOfCells++;
            drawTable(array);
            table.recalculateIndexes();
            table.addColumnWidth();
            table.addRowHeight();
            WPTB_Helper.dataTitleColumnSet(table);
            undoSelect();
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * For preventing us to take a lot of time,
     * This is just calling the function addColumnAfter, but
     * using the previous column to current one as reference.
     * @see addColumnAfter
     */

    table.addColumnBefore = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            pos = getCoords(cell)[1];

        if (pos === 0) {
            table.addColumnStart();
        } else {
            table.addColumnAfter(pos - 1);
        }
    };

    /*
     * Luckily, thisfunction is simple, 
     * it just add a row to the end of table.
     */

    table.addRowToTheEnd = function () {
        var r = table.insertRow(-1),
            td = void 0,
            aux = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table');
        r.classList.add('wptb-row');
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                var currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if (currentTableTd) {
                    var currentTdStyle = currentTableTd.getAttribute('style');

                    td.getDOMElement().setAttribute('style', currentTdStyle);
                    td.getDOMElement().style.height = null;
                }
                r.appendChild(td.getDOMElement());
            }

            aux = Array.from(array[0]);
            array.push(aux);
            drawTable(array);
            table.recalculateIndexes();
            table.addColumnWidth();
            WPTB_Helper.dataTitleColumnSet(table);
            undoSelect();
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /*
     * Yet another simple function, 
     * it just add a row to the start of table.
     */

    table.addRowToTheStart = function () {
        var r = table.insertRow(0),
            td = void 0,
            aux = void 0,
            currentTable = document.getElementsByClassName('wptb-preview-table'),
            currentTableTd = void 0,
            currentTdStyle = void 0;
        r.classList.add('wptb-row');
        if (currentTable.length > 0) {
            currentTable = currentTable[0];

            for (var i = 0; i < maxAmountOfCells; i++) {
                td = new WPTB_Cell(mark);
                var _currentTableTd = currentTable.querySelector('[data-x-index="' + i + '"]');
                if (_currentTableTd) {
                    var _currentTdStyle = _currentTableTd.getAttribute('style');

                    td.getDOMElement().setAttribute('style', _currentTdStyle);
                    td.getDOMElement().style.height = null;
                }
                r.appendChild(td.getDOMElement());
            }

            aux = Array.from(array[0]);
            array.push(aux);
            drawTable(array);
            table.recalculateIndexes();
            table.addColumnWidth();
            WPTB_Helper.dataTitleColumnSet(table);
            undoSelect();
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
    };

    /* 
     * This function adds a row before the current one.
     * Since the biggest factor of problem is a not-started but ongoing rowspan,
     * the most of the troubles is not here.
     */

    table.addRowBefore = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            cellStyle = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            cellNew = void 0;
        for (var _i10 = row - 1; _i10 >= 0; _i10--) {
            var rowChildren = table.rows[_i10].children;
            var rowChildrenLength = rowChildren.length;
            if (rowChildrenLength > 0) {
                for (var _j4 = 0; _j4 < rowChildrenLength; _j4++) {
                    if (rowChildren[_j4].rowSpan == 1) {
                        row = _i10;
                        cellNew = true;
                        break;
                    }
                }
            }
            if (cellNew) {
                break;
            }
        }

        if (row === 0) {
            table.addRowToTheStart();
        } else {
            table.addRowAfter(row, cellStyle);
        }
    };

    /*
     * Well... by the name convention of the previous 3 functions,
     * it's pretty obvious that this functions attaches a new
     * row after highlighted cell row. The greatest obstacle it was
     * the possibility of a TR not having the exact amount of columns
     * occuped by actual node but rowspanned upper cells. For that purpose
     * it was created the function realTimeArray.
     * @see realTimeArray
     */

    table.addRowAfter = function (row, cellStyle) {
        var cellRowSpan = void 0,
            rowAfter = void 0,
            aux = void 0;

        if ((row == undefined || typeof row !== 'number') && cellStyle == undefined) {
            var _cell = document.querySelector('.wptb-highlighted');
            cellStyle = _cell.getAttribute('style'), row = getCoords(_cell)[0], cellRowSpan = _cell.rowSpan, rowAfter = row + cellRowSpan - 1;
        } else {
            rowAfter = row;
        }

        var cellsColSpan = 0;
        if (rowAfter < table.rows.length - 1) {
            for (var _i11 = 0; _i11 <= rowAfter; _i11++) {
                var tableRowsIChildren = table.rows[_i11].children,
                    tableRIChildrenLength = tableRowsIChildren.length;
                if (tableRIChildrenLength > 0) {
                    for (var _j5 = 0; _j5 < tableRIChildrenLength; _j5++) {
                        var rowIRowSpan = tableRowsIChildren[_j5].rowSpan;

                        if (rowIRowSpan - 1 + _i11 > rowAfter) {
                            tableRowsIChildren[_j5].rowSpan++;
                        }
                    }
                }
            }

            var rNext = table.rows[rowAfter + 1],
                rNextChildren = rNext.children,
                rNextChildrenLength = rNextChildren.length;

            if (rNextChildrenLength > 0) {
                for (var _i12 = 0; _i12 < rNextChildrenLength; _i12++) {
                    cellsColSpan += rNextChildren[_i12].colSpan;
                }
            }
        } else {
            cellsColSpan = array[0].length;
        }

        var r = table.insertRow(rowAfter + 1);
        r.classList.add('wptb-row');

        for (j = 0; j < cellsColSpan; j++) {
            var td = new WPTB_Cell(mark);
            td.getDOMElement().setAttribute('style', cellStyle);
            td.getDOMElement().style.width = null;
            td.getDOMElement().style.height = null;
            r.appendChild(td.getDOMElement());
        }

        aux = Array.from(array[0]);
        array.push(aux);
        drawTable(array);
        table.recalculateIndexes();
        table.addColumnWidth();
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This function checks the current selected cells
     * make a rectangular shape.
     * @param Array the abstract table.
     * @return false, if not making a rectangle, or
     *	Array an array containing number of rows and columns, if selection makes a rectangle.
     */

    table.isSquare = function (a) {
        var rowStart = -1,
            columnStart = -1,
            rowEnd = -1,
            columnEnd = -1,
            height,
            width,
            itemsEstimate = 0,
            items = 0;

        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                if (a[i][j] == 1) {
                    if (j < columnStart || columnStart == -1) {
                        columnStart = j;
                    }
                    if (i < rowStart || rowStart == -1) {
                        rowStart = i;
                    }
                }
            }
        }

        for (var i = a.length - 1; i > -1; i--) {
            for (var j = a[i].length - 1; j > -1; j--) {
                if (a[i][j] == 1) {
                    if (j > columnEnd) {
                        columnEnd = j;
                    }
                    if (i > rowEnd) {
                        rowEnd = i;
                    }
                }
            }
        }

        for (var i = rowStart; i < rowEnd; i++) {
            for (var j = columnStart; j < columnEnd; j++) {
                if (a[i][j] == 0 || a[i][j] == undefined) {
                    return false;
                }
            }
        }

        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                if (a[i][j] == 1) {
                    items++;
                }
            }
        }

        height = rowEnd - rowStart + 1;
        width = columnEnd - columnStart + 1;
        itemsEstimate = height * width;

        if (itemsEstimate !== items) {
            return false;
        }
        return [height, width];
    };

    /*
     * This function merges all selected cells.
     * Well, actually sets the colspan and rowspan of first 
     * upper left  cell in selection and deletes the another selected cells.
     */

    table.mergeCells = function () {
        var dimensions = table.isSquare(array),
            rowspan = dimensions[0],
            colspan = dimensions[1],
            first = document.querySelector('.wptb-highlighted'),
            tds = [].slice.call(document.getElementsByClassName('wptb-highlighted'), 1),
            tdsChildrenNew = [];

        for (var _i13 = 0; _i13 < tds.length; _i13++) {
            var tdsInternalElements = tds[_i13].getElementsByClassName('wptb-ph-element');
            if (tdsInternalElements.length > 0) {
                var tdsIntElemLength = tdsInternalElements.length;
                for (var _j6 = 0; _j6 < tdsIntElemLength; _j6++) {
                    tdsChildrenNew.push(tdsInternalElements[_j6]);
                }
            }
            var p = tds[_i13].parentNode;
            p.removeChild(tds[_i13]);
        }
        if (tdsChildrenNew.length > 0) {
            for (var _i14 = 0; _i14 < tdsChildrenNew.length; _i14++) {
                first.appendChild(tdsChildrenNew[_i14]);
            }
        }

        first.colSpan = colspan;
        first.rowSpan = rowspan;
        table.recalculateIndexes();
        table.reconstraction();
        var firstWidth = first.style.width;
        var firstDataFixedWidth = first.dataset.wptbFixedWidth;
        if (firstWidth) {
            table.addColumnWidth(parseFloat(firstWidth, 10));
        } else if (firstDataFixedWidth) {
            table.addColumnWidth();
        } else {
            table.addColumnWidth(false, true);
        }

        var firstHeight = first.style.height;
        var firstDataFixedHeight = first.dataset.wptbFixedHeight;
        if (firstHeight) {
            table.addRowHeight(parseFloat(firstHeight, 10));
        } else if (firstDataFixedHeight) {
            table.addRowHeight();
        } else {
            table.addRowHeight(false, true);
        }
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This functions makes the exact inverse as above.
     * It resets colspan and rowspan and appends 
     * the same amount in cells to the table.
     * @bug
     */

    table.splitCell = function () {
        var cell = document.getElementsByClassName('wptb-highlighted')[0],
            rowspan = cell.rowSpan,
            colspan = cell.colSpan,
            cellStyles = cell.getAttribute('style'),
            row = getCoords(cell)[0],
            thisRow = table.rows[row],
            cellXIndex = cell.dataset.xIndex;

        cell.rowSpan = 1;
        cell.colSpan = 1;

        for (var _i15 = 1; _i15 < colspan; _i15++) {
            var td = new WPTB_Cell(mark);
            td.getDOMElement().setAttribute('style', cellStyles);
            td.getDOMElement().classList.add('wptb-highlighted');
            if (cell.nextSibling) {
                thisRow.insertBefore(td.getDOMElement(), cell.nextSibling);
            } else {
                thisRow.appendChild(td.getDOMElement());
            }
        }

        if (rowspan > 1) {
            for (var _i16 = 1; _i16 < rowspan; _i16++) {
                var rowChildInsertBefore = undefined,
                    rowNext = table.rows[row + _i16],
                    rowChildren = rowNext.children,
                    rowChildrenLength = rowChildren.length;

                if (rowChildrenLength > 0) {
                    for (var _k5 = 0; _k5 < rowChildrenLength; _k5++) {
                        if (Number(rowChildren[_k5].dataset.xIndex) > Number(cellXIndex)) {
                            rowChildInsertBefore = rowChildren[_k5];
                            break;
                        }
                    }
                }
                for (var _j7 = 0; _j7 < colspan; _j7++) {
                    var _td = new WPTB_Cell(mark);
                    _td.getDOMElement().setAttribute('style', cellStyles);
                    if (rowChildInsertBefore != undefined) {
                        rowNext.insertBefore(_td.getDOMElement(), rowChildInsertBefore);
                    } else {
                        rowNext.appendChild(_td.getDOMElement());
                    }
                }
            }
        }

        table.recalculateIndexes();
        table.reconstraction();
        table.addColumnWidth();
        table.addRowHeight();
        WPTB_Helper.dataTitleColumnSet(table);
        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * Searches for rowspanned cells up to row number meeting it.
     * @param number the number of row where the function
     * must search up to.
     */

    table.findRowspannedCells = function (row) {
        var array = [],
            difference;
        actualPoints = getActualPointsInRow(row);
        if (actualPoints === maxAmountOfCells) {
            return [];
        }
        difference = maxAmountOfCells - actualPoints;

        for (var i = row - 1; i >= 0 && difference; i--) {
            var tds = table.rows[i].getElementsByTagName('td');
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].rowSpan > 1) {
                    array.push(tds[i]);
                    difference -= tds[i].colSpan;
                }
            }
        }
        return array;
    };

    /*
     * This function explores the table and adds 
     * a cell for each lacking one for each row
     * to meet an even amount of cells.
     */

    table.addLackingCells = function () {
        var sumRows = [];
        for (var i = 0; i < table.rows.length; i++) {
            sumRows.push(0);
        }

        for (var i = 0; i < table.rows.length; i++) {
            var tds = table.rows[i].getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                if (tds[j].rowSpan > 1) {
                    for (var k = 1; k < tds[j].rowSpan; k++) {
                        sumRows[i + k]++;
                    }
                }
            }
        }

        for (var i = 0; i < table.rows.length; i++) {
            var tds = table.rows[i].getElementsByTagName('td'),
                totalColspan = 0;
            for (var j = 0; j < tds.length; j++) {
                totalColspan += tds[j].colSpan;
            }
            totalColspan += sumRows[i];
            difference = maxAmountOfCells - totalColspan;
            for (var j = 0; j < difference; j++) {
                var td = new WPTB_Cell(mark);
                table.rows[i].appendChild(td.getDOMElement());
                //table.rows[i].insertBefore( td.getDOMElement(), rows[i].nextSibling );
            }
        }
    };

    /*
     * This function deletes the row of currently
     * selected cell. 
     */

    table.deleteRow = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            cellStyles = cell.getAttribute('style'),
            rowspan = cell.rowSpan,
            row = getCoords(cell)[0],
            thisRow = void 0,
            aux = void 0;

        if (rowspan == undefined) rowspan = 1;

        for (var _i17 = 0; _i17 < rowspan; _i17++) {
            thisRow = table.rows[row];
            var thisRowChildren = thisRow.children,
                nextRow = table.rows[row + 1],
                nextRowChildren = void 0,
                nextRowChildrenLength = void 0,
                tdArr = [];

            if (nextRow != undefined) {
                nextRowChildren = nextRow.children;
                nextRowChildrenLength = nextRowChildren.length;
                for (var _j8 = 0; _j8 < thisRowChildren.length; _j8++) {
                    if (thisRowChildren[_j8].rowSpan > 1) {
                        var td = new WPTB_Cell(mark);
                        td.getDOMElement().setAttribute('style', cellStyles);
                        td.getDOMElement().colSpan = thisRowChildren[_j8].colSpan;
                        td.getDOMElement().rowSpan = thisRowChildren[_j8].rowSpan - 1;

                        var nextRowChildrenK = undefined;
                        for (var _k6 = 0; _k6 < nextRowChildrenLength; _k6++) {
                            if (Number(nextRowChildren[_k6].dataset.xIndex) > Number(thisRowChildren[_j8].dataset.xIndex)) {
                                nextRowChildrenK = nextRowChildren[_k6];
                                break;
                            }
                        }

                        if (nextRowChildrenK) {
                            tdArr.push([td, nextRowChildrenK]);
                        } else {
                            tdArr.push([td]);
                        }
                    }
                }

                if (tdArr.length > 0) {
                    for (var _k7 = 0; _k7 < tdArr.length; _k7++) {
                        if (tdArr[_k7][1] != undefined) {
                            nextRow.insertBefore(tdArr[_k7][0].getDOMElement(), tdArr[_k7][1]);
                        } else {
                            nextRow.appendChild(tdArr[_k7][0].getDOMElement());
                        }
                    }
                }
            }

            var tableRows = table.rows;
            if (tableRows.length > 0) {
                for (var _j9 = 0; _j9 < row; _j9++) {
                    var jRowChildren = tableRows[_j9].children;
                    if (jRowChildren.length > 0) {
                        for (var x = 0; x < jRowChildren.length; x++) {
                            if (jRowChildren[x].rowSpan - 1 >= row - _j9) {
                                jRowChildren[x].rowSpan--;
                            }
                        }
                    }
                }
            }
            aux = Array.from(array[0]);
            array.pop(aux);
            drawTable(array);
            table.getElementsByTagName('tbody')[0].removeChild(table.rows[row]);

            if (table.rows.length == 0) {
                table.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                WPTB_Helper.settingsPanelClear();
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
            }

            table.recalculateIndexes();
            WPTB_Helper.dataTitleColumnSet(table);
        }

        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    /*
     * This function deletes the column of currently
     * selected cell. Again, this is way more complicated than
     * delete row case.
     */

    table.deleteColumn = function () {
        var cell = document.querySelector('.wptb-highlighted'),
            cellXIndex = cell.dataset.xIndex,
            colspan = cell.colSpan;

        for (var _i18 = 0; _i18 < colspan; _i18++) {
            for (var _j10 = 0; _j10 < table.rows.length; _j10++) {
                var rowChildren = table.rows[_j10].children;
                var rowChildrenLength = rowChildren.length;
                if (rowChildrenLength > 0) {
                    for (var _k8 = rowChildrenLength - 1; _k8 >= 0; _k8--) {
                        if (Number(rowChildren[_k8].dataset.xIndex) == Number(cellXIndex)) {
                            if (rowChildren[_k8].colSpan > 1) {
                                rowChildren[_k8].colSpan--;
                            } else {
                                table.rows[_j10].removeChild(rowChildren[_k8]);
                            }
                            break;
                        } else if (Number(rowChildren[_k8].dataset.xIndex) < Number(cellXIndex) && Number(rowChildren[_k8].dataset.xIndex) + Number(rowChildren[_k8].colSpan - 1) >= cellXIndex) {
                            if (rowChildren[_k8].colSpan > 1) {
                                rowChildren[_k8].colSpan--;
                            }
                            break;
                        }
                    }
                }
            }

            for (var _j11 = 0; _j11 < table.rows.length; _j11++) {
                if (array[_j11] != undefined) array[_j11].pop();
            }

            maxAmountOfCells--;

            if (table.querySelectorAll('td').length == 0) {
                table.toggleTableEditMode();
                wptbTableSetup.innerHTML = '';
                WPTB_Helper.settingsPanelClear();
                document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
            }

            table.recalculateIndexes();
            table.tdDefaultWidth();
            WPTB_Helper.dataTitleColumnSet(table);
        }

        undoSelect();
        var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
        wptbTableStateSaveManager.tableStateSet();
    };

    document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

    array = fillTableArray();

    undoSelect();
    drawTable(array);

    wptbTableSetup.appendChild(table);
    //if (columns || rows) {
    table.recalculateIndexes(true);
    //}
    table.reconstraction();
    table.tdDefaultWidth();

    wptbTableSetup.onresize = function () {
        table.tdDefaultWidth();
    };

    WPTB_LeftPanel();

    // this code gets the ID of the active element in the toolbar 
    // and stores it in the data attribute of the common container element "wpcd_fixed_toolbar"
    //    let wptbPhElement = document.getElementsByClassName( 'wptb-ph-element' );
    //    let wpcdFixedToolbar = document.getElementById( 'wpcd_fixed_toolbar' );
    //    for ( let i = 0; i < wptbPhElement.length; i++ ) {
    //        wptbPhElement[i].addEventListener( 'click', function( e ) {
    //            let wptbToolbar = document.getElementById( 'wpcd_fixed_toolbar' ).children;
    //            for ( let j = 0; j < wptbToolbar.length; j++ ) {
    //                let elementStyles = window.getComputedStyle( wptbToolbar[j], 'null' );
    //                if( elementStyles.getPropertyValue( 'display' ) == 'block' ) {
    //                    wpcdFixedToolbar.dataset.toolbarActiveId = wptbToolbar[j].getAttribute( 'id' );
    //                }
    //            }
    //        }, false );
    //    }

    //    let wptbPanelLeft = document.getElementsByClassName( 'wptb-panel-left' );
    //    if( wptbPanelLeft.length > 0 ) {
    //        wptbPanelLeft[0].addEventListener( 'click', function( e ) {
    //            let toolbarActiveElementId = wpcdFixedToolbar.dataset.toolbarActiveId;
    //            document.getElementById( toolbarActiveElementId ).style.display = '';
    //        }, false );
    //    }

    //    let body = document.getElementsByTagName( 'body' );
    //    if( body.length > 0 ) {
    //        body[0].addEventListener( 'click', function( e ) {
    //            if ( e.target.classList.contains( 'wptb-panel-left' ) || WPTB_Helper.findAncestor( e.target, 'wptb-panel-left' ) ) {
    //                let toolbarActiveElementId = wpcdFixedToolbar.dataset.toolbarActiveId;
    //                document.getElementById( toolbarActiveElementId ).style.display = '';
    //            }
    //        }, false );
    //    }
};
var WPTB_TableStateSaveManager = function WPTB_TableStateSaveManager() {
    this.tableStateSet = function () {
        // get preview table
        var wptbPreviewTable = document.getElementsByClassName('wptb-preview-table');
        if (wptbPreviewTable.length > 0) {
            wptbPreviewTable = wptbPreviewTable[0];

            // check if a global array doesn't exist with saved versions of the table 
            // them create it
            if (!window.wptbTableStateSaving) {
                window.wptbTableStateSaving = [];
            }

            // remove the extra part of the array after changing the table 
            // when it is showed in the not last modified version
            if (window.wptbTableStateSaving.length > window.wptbTableStateNumberShow + 1) {
                window.wptbTableStateSaving = window.wptbTableStateSaving.slice(0, window.wptbTableStateNumberShow + 1);
            }

            //add new state of table
            var wptbNewPreviewTable = wptbPreviewTable.cloneNode(true);
            var wptbHighlighted = wptbNewPreviewTable.getElementsByClassName('wptb-highlighted');
            for (var i = 0; i < wptbHighlighted.length; i++) {
                wptbHighlighted[i].classList.remove('wptb-highlighted');
            }
            var wptbDirectlyhovered = wptbNewPreviewTable.getElementsByClassName('wptb-directlyhovered');
            for (var _i = 0; _i < wptbDirectlyhovered.length; _i++) {
                wptbDirectlyhovered[_i].classList.remove('wptb-directlyhovered');
            }

            var cssForTdsWidthAutoValue = '';
            var head = document.head;
            if (head) {
                var cssForTdsWidthAuto = head.querySelector('style[data-wptb-td-auto-width="true"]');
                if (cssForTdsWidthAuto) {
                    cssForTdsWidthAutoValue = cssForTdsWidthAuto.innerHTML;
                }
            }

            var wptbDlementDatas = document.getElementsByClassName('wptb-element-datas');
            if (wptbDlementDatas.length > 0) {
                wptbDlementDatas = wptbDlementDatas.innerHTML;
            } else {
                wptbDlementDatas = '';
            }

            var mceContentBodys = wptbNewPreviewTable.querySelectorAll('.mce-content-body');
            if (mceContentBodys.length > 0) {
                for (var k = 0; k < mceContentBodys.length; k++) {
                    mceContentBodys[k].classList.remove('mce-content-body');
                }
            }

            var dataMceStyle = wptbNewPreviewTable.querySelectorAll('[data-mce-style]');
            if (dataMceStyle.length > 0) {
                for (var _k = 0; _k < dataMceStyle.length; _k++) {
                    dataMceStyle[_k].removeAttribute('data-mce-style');
                }
            }

            var mceIds = wptbNewPreviewTable.querySelectorAll('[id^=mce_]');
            if (mceIds.length > 0) {
                for (var _k2 = 0; _k2 < mceIds.length; _k2++) {
                    mceIds[_k2].removeAttribute('id');
                }
            }

            window.wptbTableStateSaving.push([wptbNewPreviewTable, cssForTdsWidthAutoValue, wptbDlementDatas]);

            // set new number of state which is showed now
            window.wptbTableStateNumberShow = window.wptbTableStateSaving.length - 1;

            // make undo arrow active when the table was changed
            if (window.wptbTableStateSaving.length > 1) {
                var wptbUndo = document.getElementsByClassName('wptb-undo');
                if (wptbUndo.length > 0) {
                    wptbUndo = wptbUndo[0];

                    wptbUndo.classList.remove('wptb-undoredo-disabled');
                }
            }

            // make redo arrow not active when the table was changed
            var wptbRedo = document.getElementsByClassName('wptb-redo');
            if (wptbRedo.length > 0) {
                wptbRedo = wptbRedo[0];

                wptbRedo.classList.add('wptb-undoredo-disabled');
            }

            var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
            if (wptbSaveBtn.length > 0) {
                wptbSaveBtn = wptbSaveBtn[0];
                if (!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave) {
                    wptbSaveBtn.classList.add('wptb-save-disabled');
                } else {
                    wptbSaveBtn.classList.remove('wptb-save-disabled');
                }
            }
        }
    };

    this.tableStateGet = function (datawptbUndoredo) {
        if (datawptbUndoredo && window.wptbTableStateSaving && window.wptbTableStateSaving.length > 1) {

            // changes the number of the state which displays now
            if (datawptbUndoredo == 'undo') {
                if (window.wptbTableStateNumberShow > 0) {
                    window.wptbTableStateNumberShow--;
                } else {
                    return false;
                }
            } else if (datawptbUndoredo == 'redo') {
                if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length - 1) {
                    window.wptbTableStateNumberShow++;
                } else {
                    return false;
                }
            }

            // add or delete class "wptb-undoredo-disabled" for undo button
            var wptbUndo = document.getElementsByClassName('wptb-undo');
            if (wptbUndo.length > 0) {
                wptbUndo = wptbUndo[0];
            }
            if (window.wptbTableStateNumberShow == 0) {
                if (wptbUndo) {
                    wptbUndo.classList.add('wptb-undoredo-disabled');
                }
            } else if (window.wptbTableStateNumberShow > 0) {
                if (wptbUndo) {
                    wptbUndo.classList.remove('wptb-undoredo-disabled');
                }
            }

            // add or delete class "wptb-undoredo-disabled" for redo button
            var wptbRedo = document.getElementsByClassName('wptb-redo');
            if (wptbRedo.length > 0) {
                wptbRedo = wptbRedo[0];
            }
            if (window.wptbTableStateNumberShow == window.wptbTableStateSaving.length - 1) {
                if (wptbRedo) {
                    wptbRedo.classList.add('wptb-undoredo-disabled');
                }
            } else if (window.wptbTableStateNumberShow < window.wptbTableStateSaving.length - 1) {
                if (wptbRedo) {
                    wptbRedo.classList.remove('wptb-undoredo-disabled');
                }
            }

            var wptbSaveBtn = document.getElementsByClassName('wptb-save-btn');
            if (wptbSaveBtn.length > 0) {
                wptbSaveBtn = wptbSaveBtn[0];
                if (!wptbSaveBtn.dataset.wptbTableStateNumberSave && window.wptbTableStateNumberShow == 0 || window.wptbTableStateNumberShow == wptbSaveBtn.dataset.wptbTableStateNumberSave) {
                    wptbSaveBtn.classList.add('wptb-save-disabled');
                } else {
                    wptbSaveBtn.classList.remove('wptb-save-disabled');
                }
            }

            // load necessary saved table state
            var wptbTableSetup = document.getElementsByClassName('wptb-table-setup');
            if (wptbTableSetup.length > 0) {
                wptbTableSetup = wptbTableSetup[0];

                wptbTableSetup.innerHTML = '';
                wptbTableSetup.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][0].outerHTML;

                if (window.wptbTableStateSaving[window.wptbTableStateNumberShow][1]) {
                    var cssForTdsWidthAuto = document.createElement('style');
                    cssForTdsWidthAuto.setAttribute('data-wptb-td-auto-width', true);
                    cssForTdsWidthAuto.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][1];
                    var head = document.head;
                    if (head) {
                        var cssForTdsWidthAutoOld = head.querySelector('style[data-wptb-td-auto-width="true"]');
                        if (cssForTdsWidthAutoOld) {
                            head.removeChild(cssForTdsWidthAutoOld);
                        }
                        head.appendChild(cssForTdsWidthAuto);
                    }
                }

                var wptbElementDatas = document.getElementsByClassName('wptb-element-datas');
                var body = document.getElementsByTagName('body');
                if (body.length > 0) {
                    body = body[0];
                }
                if (window.wptbTableStateSaving[window.wptbTableStateNumberShow][2]) {
                    wptbElementDatas.innerHTML = window.wptbTableStateSaving[window.wptbTableStateNumberShow][2];

                    if (wptbElementDatas.length > 0) {
                        wptbElementDatas = wptbElementDatas[0];
                    } else {
                        wptbElementDatas = document.createElement('div');
                        wptbElementDatas.classList.add('wptb-element-datas');
                        body.appendChild(wptbElementDatas);
                    }
                } else {
                    if (wptbElementDatas.length > 0) {
                        wptbElementDatas = wptbElementDatas[0];
                        body.removeChild(wptbElementDatas);
                    }
                }

                WPTB_Helper.settingsPanelClear();
                WPTB_Helper.elementOptionsPanelClear();
                WPTB_LeftPanel();

                var wptbLeftScrollPanelCellSetting = document.getElementById('wptb-left-scroll-panel-cell-settings');
                if (wptbLeftScrollPanelCellSetting) {
                    wptbLeftScrollPanelCellSetting.classList.remove('visible');
                }
            }
        }
    };
};
var WPTB_innerElementSet = function WPTB_innerElementSet(element) {

    element.ondragenter = function (e) {
        var div;
        if (e.dataTransfer.types.indexOf('wptbelement') == -1 && e.dataTransfer.types.indexOf('wptb-moving-mode') == -1) {
            return;
        }
        WPTB_DropHandle(this, e);

        element.classList.add('wptb-ondragenter');
    };
    element.ondragover = function (e) {
        e.preventDefault();
        WPTB_DropHandle(this, e);
    };
    element.ondragleave = function () {};
    element.ondrop = function (e) {
        this.classList.remove('wptb-ondragenter');
        var element = void 0,
            classId = void 0;
        e.preventDefault();
        e.stopPropagation();

        if (!e.dataTransfer.getData('wptbElement') && !e.dataTransfer.getData('node')) {
            return;
        }
        var wptbDropHandle = void 0,
            wptbDropBorderMarker = void 0;
        if (document.getElementsByClassName('wptb-drop-handle').length > 0) {
            wptbDropHandle = document.getElementsByClassName('wptb-drop-handle')[0];
        }
        if (document.getElementsByClassName('wptb-drop-border-marker').length > 0) {
            wptbDropBorderMarker = document.getElementsByClassName('wptb-drop-border-marker')[0];
        }

        if (e.dataTransfer.getData('wptbElement')) {
            element = WPTB_Helper.newElementProxy(e.dataTransfer.getData('wptbElement'));
            element = element.getDOMElement();
        } else {
            classId = e.dataTransfer.getData('node');
            element = document.getElementsByClassName(classId)[0];
            //element.classList.remove( 'wptb-moving-mode' );
        }

        if (wptbDropHandle.style.display == 'block') {
            var td = void 0;
            if (wptbDropHandle.dataset.text == 'Drop Here') {
                td = wptbDropHandle.getDOMParentElement();
                td.appendChild(element);
            } else {
                var innerElement = wptbDropHandle.getDOMParentElement();
                td = innerElement.parentNode;

                if (wptbDropHandle.dataset.text == 'Above Element') {
                    td.insertBefore(element, innerElement);
                } else if (wptbDropHandle.dataset.text == 'Below Element') {
                    var innerElementNext = innerElement.nextSibling;
                    td.insertBefore(element, innerElementNext);
                }
            }
            var thisRow = td.parentNode;
            if (thisRow.classList.contains('wptb-table-head')) {
                var table = WPTB_Helper.findAncestor(thisRow, 'wptb-preview-table');
                WPTB_Helper.dataTitleColumnSet(table);
            }

            // start item javascript if item is new
            var infArr = element.className.match(/wptb-element-(.+)-(\d+)/i);
            var elemKind = infArr[1];
            if (e.dataTransfer.getData('wptbElement') && (elemKind == 'text' || elemKind == 'button' || elemKind == 'image' || elemKind == 'star_rating' || elemKind == 'list')) {
                //WPTB_Helper.elementStartScript( element );
            }
        } else {
            return;
        }

        wptbDropHandle.style.display = 'none';
        wptbDropBorderMarker.style.display = 'none';

        WPTB_innerElementSet(element);

        if (!element.classList.contains('wptb-image-container') || element.classList.contains('wptb-moving-mode')) {
            element.classList.remove('wptb-moving-mode');
            var wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
        return true;
    };
    element.onmouseover = function (e) {
        element.classList.remove('wptb-ondragenter');
    };
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var applyGenericItemSettings = function applyGenericItemSettings(element, kindIndexProt) {
    var copy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var node = element.getDOMElement(),
        index,
        copy;
    if (node.classList.contains('wptb-ph-element')) {
        if (kindIndexProt == undefined || copy == true) {
            index = document.counter.nextIndex(element.kind);
            var wptbElements = document.getElementsByClassName('wptb-ph-element');
            var elementIndexesArr = [];
            for (var i = 0; i < wptbElements.length; i++) {
                var regex = new RegExp('wptb-element-' + element.kind + '-(\\d+)', "i");
                var infArr = wptbElements[i].className.match(regex);
                if (infArr) {
                    elementIndexesArr.push(infArr[1]);
                }
            }
            if (elementIndexesArr.length > 0) {
                var elementIndexMax = Math.max.apply(Math, elementIndexesArr);
                index = elementIndexMax + 1;
            } else {
                index = 1;
            }

            if (copy) {
                // change all data-elements which save parameters for different controls
                var wptbNodeattributes = [].concat(_toConsumableArray(node.attributes));
                for (var _i = 0; _i < wptbNodeattributes.length; _i++) {
                    if (wptbNodeattributes[_i] && _typeof(wptbNodeattributes[_i]) === 'object' && wptbNodeattributes[_i].nodeName) {
                        var regularText = new RegExp('data-wptb-el-' + element.kind + '-(\\d+)-(.+)', "i");
                        var attr = wptbNodeattributes[_i].nodeName.match(regularText);
                        if (attr && Array.isArray(attr)) {
                            var newDataAttributeName = wptbNodeattributes[_i].nodeName.replace(element.kind + '-' + attr[1], element.kind + '-' + index);
                            var newDataAttributeValue = wptbNodeattributes[_i].nodeValue;
                            node.removeAttribute(wptbNodeattributes[_i].nodeName);
                            node.setAttribute(newDataAttributeName, newDataAttributeValue);
                        }
                    }
                }
            }
        } else if (kindIndexProt && !copy) {
            var kindIndexProtArr = kindIndexProt.split('-');
            index = kindIndexProtArr[kindIndexProtArr.length - 1];
            // start element javascript if element is new
        }

        var node_wptb_element_kind_num = node.className.match(/wptb-element-(.+)-(\d+)/i);
        if (node_wptb_element_kind_num) {
            node.classList.remove(node_wptb_element_kind_num[0]);
        }
        if (!node.classList.contains('wptb-ph-element')) {
            node.classList.add('wptb-ph-element');
            if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
                node.classList.add('wptb-element-' + element.kind + '-' + index);
            }
        } else {
            if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
                node.classList.add('wptb-element-' + element.kind + '-' + index);
            }
        }
        new WPTB_ElementOptions(element, index, kindIndexProt);
        WPTB_Helper.elementStartScript(element.getDOMElement());
        document.counter.increment(element.kind);
    }

    node.onmouseenter = function (event) {
        if (event.target.classList.contains('wptb-moving-mode')) {
            return;
        }

        var wptbActionsField = new WPTB_ActionsField();

        wptbActionsField.addActionField(1, node);

        wptbActionsField.setParameters(node);

        node.classList.remove('wptb-ondragenter');
    };

    node.onmouseleave = function (event) {
        var wptbActionsField = new WPTB_ActionsField();

        wptbActionsField.leaveFromField(event, node);
    };
};
//# sourceMappingURL=admin.js.map
