// Rounded Rectangle Radius Resizer v1.0.1
// By David Jensen with help from ps-scripts.com

#target photoshop
var docRef = activeDocument;
if (app.documents.length > 0){
var allSelectedLayers;
var changed = false;



docRef.suspendHistory("Modify rounded rect", "main()");

            
            
makeActiveByIndex(allSelectedLayers, false);
}

function main() {
    var res = docRef.resolution;
    if(res != 72){ 
        docRef.resizeImage(undefined, undefined, 72, ResampleMethod.NONE);
        app.refresh();
    }
    allSelectedLayers = getSelectedLayersIdx();
    var selectedLayers = [];
    rects = new Array();
    for (var j = 0; j < allSelectedLayers.length; j++) {
        makeActiveByIndex([allSelectedLayers[j]], false);
        if (docRef.pathItems.length > 0 && docRef.pathItems[docRef.pathItems.length - 1].kind == PathKind.VECTORMASK) {
            selectedLayers.push(allSelectedLayers[j]);

            roundedRec = docRef.pathItems[docRef.pathItems.length - 1].subPathItems[0];
            l = roundedRec.pathPoints.length;
            upper = Infinity;
            lower = -Infinity;
            left = Infinity;
            right = -Infinity;
            for (i = 0; i < roundedRec.pathPoints.length; i++) {
                anchor = roundedRec.pathPoints[i].anchor;

                x = anchor[0];
                y = anchor[1];
                if (x < left) left = x;
                if (x > right) right = x;
                if (y < upper) upper = y;
                if (y > lower) lower = y;
            }
            rects.push(new rect(left, right, upper, lower));
        }
    }


    if (selectedLayers.length == 0 || activeDocument.activeLayer.isBackgroundLayer ){
        if(res != 72) docRef.resizeImage(undefined, undefined, res, ResampleMethod.NONE);
        return 0;
        }

    createDialog = function() {
        var dlg = new Window('dialog', 'Rounded Rect', [100, 100, 250, 280]);


        dlg.upperLeftText = dlg.add('edittext', [10, 10, 60, 30]);
        dlg.upperRightText = dlg.add('edittext', [90, 10, 140, 30]);
        dlg.lowerLeftText = dlg.add('edittext', [10, 80, 60, 100]);
        dlg.lowerRightText = dlg.add('edittext', [90, 80, 140, 100]);
        dlg.allText = dlg.add('edittext', [50, 45, 100, 65])

        dlg.applyButton = dlg.add('button', [10, 120, 100, 160], 'Apply');
        dlg.okButton = dlg.add('button', [110, 120, 140, 160], 'OK');
        return dlg;
    }

    initializeDialog = function(w) {
        makeActiveByIndex([selectedLayers[0]], false);
        roundedRec = docRef.pathItems[docRef.pathItems.length - 1].subPathItems[0];
        l = roundedRec.pathPoints.length;
        upper = rects[0].upper;
        lower = rects[0].lower;
        left = rects[0].left;
        right = rects[0].right;
        if (l <= 5) {
            radius1 = 0;
            radius2 = 0;
            radius3 = 0;
            radius4 = 0;
        } else {
            radius1 = roundedRec.pathPoints[0].anchor[0] - left;
            radius2 = right - roundedRec.pathPoints[1].anchor[0];
            radius3 = lower - roundedRec.pathPoints[3].anchor[1];
            radius4 = lower - roundedRec.pathPoints[6].anchor[1];
        }
        makeActiveByIndex(selectedLayers, false);

        w.upperLeftText.text = Math.round(radius1 * 100) / 100;
        w.upperRightText.text = Math.round(radius2 * 100) / 100;
        w.lowerRightText.text = Math.round(radius3 * 100) / 100;
        w.lowerLeftText.text = Math.round(radius4 * 100) / 100;

        // Set up initial control states
        w.applyButton.onClick = w.applyButton.onClick = function() {
            change();
        }

        w.upperLeftText.onChange = w.upperLeftText.onChange = function() {
            w.allText.text = "";
            changed = true;
        }
        w.upperRightText.onChange = w.upperLeftText.onChange = function() {
            w.allText.text = "";
            changed = true;
        }
        w.lowerLeftText.onChange = w.upperLeftText.onChange = function() {
            w.allText.text = "";
            changed = true;
        }
        w.lowerRightText.onChange = w.upperLeftText.onChange = function() {
            w.allText.text = "";
            changed = true;
        }
        w.allText.onChange = w.allText.onChange = function() {
            w.upperLeftText.text = w.allText.text;
            w.upperRightText.text = w.allText.text;
            w.lowerLeftText.text = w.allText.text;
            w.lowerRightText.text = w.allText.text;
            changed = true;


        }
        change = function() {

            if (changed == false) return;
            changed = false;
            

            
            for (var j = 0; j < selectedLayers.length; j++) {
                makeActiveByIndex([selectedLayers[j]], false);
                changeShapes(rects[j].left, rects[j].right, rects[j].upper, rects[j].lower);

                function changeShapes(left, right, upper, lower) {
                    try {
                        var idDlt = charIDToTypeID("Dlt ");
                        var desc171 = new ActionDescriptor();
                        var idnull = charIDToTypeID("null");
                        var ref129 = new ActionReference();
                        var idPath = charIDToTypeID("Path");
                        var idPath = charIDToTypeID("Path");
                        var idvectorMask = stringIDToTypeID("vectorMask");
                        ref129.putEnumerated(idPath, idPath, idvectorMask);
                        var idLyr = charIDToTypeID("Lyr ");
                        var idOrdn = charIDToTypeID("Ordn");
                        var idTrgt = charIDToTypeID("Trgt");
                        ref129.putEnumerated(idLyr, idOrdn, idTrgt);
                        desc171.putReference(idnull, ref129);
                        executeAction(idDlt, desc171, DialogModes.NO);
                    } catch (err) {}

                    var ARM_MULT = 0.4477154
                    var upperLeftRad = parseInt(w.upperLeftText.text);
                    if (isNaN(upperLeftRad)) upperLeftRad = 0;
                    var upperRightRad = parseInt(w.upperRightText.text);
                    if (isNaN(upperRightRad)) upperRightRad = 0;
                    var lowerLeftRad = parseInt(w.lowerLeftText.text);
                    if (isNaN(lowerLeftRad)) lowerLeftRad = 0;
                    var lowerRightRad = parseInt(w.lowerRightText.text);
                    if (isNaN(lowerRightRad)) lowerRightRad = 0;

                    var lineArray = new Array();
                    var i = 0;
                    lineArray[i] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(left + upperLeftRad, upper);
                    lineArray[i].rightDirection = Array(left + upperLeftRad * ARM_MULT, upper);
                    lineArray[i].leftDirection = lineArray[i].anchor;
                
                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(right - upperRightRad, upper);
                    lineArray[i].rightDirection = lineArray[i].anchor;
                    lineArray[i].leftDirection = Array(right - upperRightRad * ARM_MULT, upper);
                
                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(right, upper + upperRightRad);
                    lineArray[i].rightDirection = Array(right, upper + upperRightRad * ARM_MULT);
                    lineArray[i].leftDirection = lineArray[i].anchor;

                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(right, lower - lowerRightRad);
                    lineArray[i].rightDirection = lineArray[i].anchor;
                    lineArray[i].leftDirection = Array(right, lower - lowerRightRad * ARM_MULT);
                    
                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(right - lowerRightRad, lower);
                    lineArray[i].rightDirection = Array(right - lowerRightRad * ARM_MULT, lower);
                    lineArray[i].leftDirection = lineArray[i].anchor;

                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(left + lowerLeftRad, lower);
                    lineArray[i].rightDirection = lineArray[i].anchor;
                    lineArray[i].leftDirection = Array(left + lowerLeftRad * ARM_MULT, lower);

                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(left, lower - lowerLeftRad);
                    lineArray[i].rightDirection = Array(left, lower - lowerLeftRad * ARM_MULT);
                    lineArray[i].leftDirection = lineArray[i].anchor;

                    lineArray[i += 1] = new PathPointInfo;
                    lineArray[i].kind = PointKind.CORNERPOINT;
                    lineArray[i].anchor = Array(left, upper + upperLeftRad);
                    lineArray[i].rightDirection = lineArray[i].anchor;
                    lineArray[i].leftDirection = Array(left, upper + upperLeftRad * ARM_MULT);


                    var lineSubPathArray = new Array()
                    lineSubPathArray[0] = new SubPathInfo()
                    lineSubPathArray[0].operation = ShapeOperation.SHAPEXOR
                    lineSubPathArray[0].closed = true
                    lineSubPathArray[0].entireSubPath = lineArray

                    var myPathItem = docRef.pathItems.add("A Line2", lineSubPathArray);

                    // =======================================================
                    var idMk = charIDToTypeID("Mk  ");
                    var desc170 = new ActionDescriptor();
                    var idnull = charIDToTypeID("null");
                    var ref126 = new ActionReference();
                    var idPath = charIDToTypeID("Path");
                    ref126.putClass(idPath);
                    desc170.putReference(idnull, ref126);
                    var idAt = charIDToTypeID("At  ");
                    var ref127 = new ActionReference();
                    var idPath = charIDToTypeID("Path");
                    var idPath = charIDToTypeID("Path");
                    var idvectorMask = stringIDToTypeID("vectorMask");
                    ref127.putEnumerated(idPath, idPath, idvectorMask);
                    desc170.putReference(idAt, ref127);
                    var idUsng = charIDToTypeID("Usng");
                    var ref128 = new ActionReference();
                    var idPath = charIDToTypeID("Path");
                    var idOrdn = charIDToTypeID("Ordn");
                    var idTrgt = charIDToTypeID("Trgt");
                    ref128.putEnumerated(idPath, idOrdn, idTrgt);
                    desc170.putReference(idUsng, ref128);
                    executeAction(idMk, desc170, DialogModes.NO);
                    try {
                        var idDlt = charIDToTypeID("Dlt ");
                        var desc16 = new ActionDescriptor();
                        var idnull = charIDToTypeID("null");
                        var ref7 = new ActionReference();
                        var idPath = charIDToTypeID("Path");
                        ref7.putName(idPath, "A Line2");
                        desc16.putReference(idnull, ref7);
                        executeAction(idDlt, desc16, DialogModes.NO);
                    } catch (err) {}

                }
            }

            var idDslc = charIDToTypeID("Dslc");
            var desc4 = new ActionDescriptor();
            var idnull = charIDToTypeID("null");
            var ref2 = new ActionReference();
            var idPath = charIDToTypeID("Path");
            ref2.putClass(idPath);
            desc4.putReference(idnull, ref2);
            executeAction(idDslc, desc4, DialogModes.NO);

            app.refresh();
        }
    }


    runDialog = function(w) {
        return w.show();
    };
    var win = createDialog();
    initializeDialog(win);
    if (runDialog(win) == 1) {
        change();
    }
    if(res != 72) docRef.resizeImage(undefined, undefined, res, ResampleMethod.NONE);
}

function getSelectedLayersIdx() {
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count
        var selectedLayers = new Array();
        for (var i = 0; i < c; i++) {
            try {
                docRef.backgroundLayer;
                selectedLayers.push(desc.getReference(i).getIndex());
            } catch (e) {
                selectedLayers.push(desc.getReference(i).getIndex() + 1);
            }
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        try {
            docRef.backgroundLayer;
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
        } catch (e) {
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
        }
    }
    return selectedLayers;
}

function makeActiveByIndex(idx, visible) {
    for (var i = 0; i < idx.length; i++) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), idx[i])
        desc.putReference(charIDToTypeID("null"), ref);
        if (i > 0) {
            var idselectionModifier = stringIDToTypeID("selectionModifier");
            var idselectionModifierType = stringIDToTypeID("selectionModifierType");
            var idaddToSelection = stringIDToTypeID("addToSelection");
            desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
        }
        desc.putBoolean(charIDToTypeID("MkVs"), visible);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
}

function rect(left, right, upper, lower) {
    this.left = left;
    this.right = right;
    this.upper = upper;
    this.lower = lower;
}​