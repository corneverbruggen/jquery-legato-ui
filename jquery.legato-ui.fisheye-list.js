(function($) {

 // TODO: animate as option
 // TODO: options object
 // TODO: zoom icon as option
 // TODO: icon as option
  $.fn.fisheye = function() {
    var $items = this.children(),
        previousItem,
        itemIndex, 
        previousItemIndex,
        zoomLevels = [[70, 40], [40,30], [30,20], [20,10], [10,10]],
        zoomSteps = zoomLevels.length - 1,  // #levels minus 1 max
        maxZoomHeight = zoomLevels[0][0],
        maxZoomFontSize = zoomLevels[0][1],
        defaultHeight = zoomLevels[zoomLevels.length - 1][0],
        defaultFontSize = zoomLevels[zoomLevels.length - 1][1],
        zoomFractions = [];

    for(var level = 0 ; level < zoomSteps ; level++) {
      zoomFractions[level] = [
        maxZoomHeight/(zoomLevels[level][0] - zoomLevels[level + 1][0]),
        maxZoomHeight/(zoomLevels[level][1] - zoomLevels[level + 1][1])
      ]
    }

    $items.mousemove(
      function(e) {
        var distance;
        itemIndex = $items.index(this);
        previousItemIndex = $items.index(previousItem);
       
        // Calculate cursor position relative to the top-border of the current entry
        var delta = e.pageY - ($(this).offset().top);
        // Set current entry to maximum zoom level
        $(this).css({height: maxZoomHeight, fontSize: maxZoomFontSize});
  
       // Adjust previous entries
       for(var i = itemIndex - zoomSteps, zl = zoomSteps ; i < itemIndex ; (i++, zl--)) { // - 2 because length-to-index is 1, and last zoomlevel is default
          $($items[i]).css({
            height: zoomLevels[zl-1][0] - delta/zoomFractions[zl-1][0],
            fontSize: zoomLevels[zl-1][1] - delta/zoomFractions[zl-1][1]
          });
        }
        // Adjust next entries
        for(var i = itemIndex + 1, zl = 1 ; i <= itemIndex + zoomSteps ; (i++, zl++)) { // - 2 because length-to-index is 1, and last zoomlevel is default
          $($items[i]).css({
            height: zoomLevels[zl][0] + delta/zoomFractions[zl-1][0],
            fontSize: zoomLevels[zl][1] + delta/zoomFractions[zl-1][1]
          });
        }
        // Reset items that are no longer in zoom area, i.e. were not set
        // to correct zoom factor already
        if(previousItem !== this) { 
          distance = itemIndex - previousItemIndex
          if(distance < 0) { 
            $items.slice(
              Math.max(previousItemIndex - zoomSteps, itemIndex + 1 + zoomSteps),
              Math.max(previousItemIndex + 1 + zoomSteps, itemIndex - zoomSteps - 1)
            ).css({height: defaultHeight, fontSize: defaultFontSize});
          }
          else { 
            $items.slice(
              Math.min(Math.max(0,previousItemIndex - zoomSteps), itemIndex - zoomSteps - 1),
              Math.min(previousItemIndex + 1 + zoomSteps, Math.max(0, itemIndex - zoomSteps))
            ).css({height: defaultHeight, fontSize: defaultFontSize});
          }
        }
        previousItem = this;
      }    
    );
    return this;
  };
})(jQuery);

