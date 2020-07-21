import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var DomHelper = /** @class */ (function () {
    function DomHelper() {
    }
    DomHelper_1 = DomHelper;
    DomHelper.setYAxisPosition = function (element, container, anchor, drops) {
        var anchorRect = anchor.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        var bottom = anchorRect.bottom - containerRect.top;
        var top = anchorRect.top - containerRect.top;
        if (drops === 'down') {
            element.style.top = (bottom + 1 + 'px');
        }
        else {
            element.style.top = (top - 1 - element.scrollHeight) + 'px';
        }
    };
    DomHelper.setXAxisPosition = function (element, container, anchor, dimElem, opens) {
        var anchorRect = anchor.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        var left = anchorRect.left - containerRect.left;
        if (opens === 'right') {
            element.style.left = left + 'px';
        }
        else {
            element.style.left = left - dimElem.offsetWidth + anchor.offsetWidth + 'px';
        }
    };
    DomHelper.isTopInView = function (el) {
        var top = el.getBoundingClientRect().top;
        return (top >= 0);
    };
    DomHelper.isBottomInView = function (el) {
        var bottom = el.getBoundingClientRect().bottom;
        return (bottom <= window.innerHeight);
    };
    DomHelper.isLeftInView = function (el) {
        var left = el.getBoundingClientRect().left;
        return (left >= 0);
    };
    DomHelper.isRightInView = function (el) {
        var right = el.getBoundingClientRect().right;
        return (right <= window.innerWidth);
    };
    DomHelper.prototype.appendElementToPosition = function (config) {
        var _this = this;
        var container = config.container, element = config.element;
        if (!container.style.position || container.style.position === 'static') {
            container.style.position = 'relative';
        }
        if (element.style.position !== 'absolute') {
            element.style.position = 'absolute';
        }
        element.style.visibility = 'hidden';
        setTimeout(function () {
            _this.setElementPosition(config);
            element.style.visibility = 'visible';
        });
    };
    DomHelper.prototype.setElementPosition = function (_a) {
        var element = _a.element, container = _a.container, anchor = _a.anchor, dimElem = _a.dimElem, drops = _a.drops, opens = _a.opens;
        DomHelper_1.setYAxisPosition(element, container, anchor, 'down');
        DomHelper_1.setXAxisPosition(element, container, anchor, dimElem, 'right');
        if (drops !== 'down' && drops !== 'up') {
            if (DomHelper_1.isBottomInView(dimElem)) {
                DomHelper_1.setYAxisPosition(element, container, anchor, 'down');
            }
            else if (DomHelper_1.isTopInView(dimElem)) {
                DomHelper_1.setYAxisPosition(element, container, anchor, 'up');
            }
        }
        else {
            DomHelper_1.setYAxisPosition(element, container, anchor, drops);
        }
        if (opens !== 'left' && opens !== 'right') {
            if (DomHelper_1.isRightInView(dimElem)) {
                DomHelper_1.setXAxisPosition(element, container, anchor, dimElem, 'right');
            }
            else if (DomHelper_1.isLeftInView(dimElem)) {
                DomHelper_1.setXAxisPosition(element, container, anchor, dimElem, 'left');
            }
        }
        else {
            DomHelper_1.setXAxisPosition(element, container, anchor, dimElem, opens);
        }
    };
    var DomHelper_1;
    DomHelper.ɵprov = i0.ɵɵdefineInjectable({ factory: function DomHelper_Factory() { return new DomHelper(); }, token: DomHelper, providedIn: "root" });
    DomHelper = DomHelper_1 = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], DomHelper);
    return DomHelper;
}());
export { DomHelper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLWFwcGVuZGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzItZGF0ZS1waWNrZXIvIiwic291cmNlcyI6WyJjb21tb24vc2VydmljZXMvZG9tLWFwcGVuZGVyL2RvbS1hcHBlbmRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQU16QztJQUFBO0tBMkZDO2tCQTNGWSxTQUFTO0lBRUwsMEJBQWdCLEdBQS9CLFVBQWdDLE9BQW9CLEVBQUUsU0FBc0IsRUFBRSxNQUFtQixFQUFFLEtBQWE7UUFDOUcsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDbEQsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDeEQsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDO1FBQ3JELElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUUvQyxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQztTQUM3RDtJQUNILENBQUM7SUFFYywwQkFBZ0IsR0FBL0IsVUFBZ0MsT0FBb0IsRUFBRSxTQUFzQixFQUFFLE1BQW1CLEVBQUUsT0FBb0IsRUFBRSxLQUFhO1FBQ3BJLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2xELElBQU0sYUFBYSxHQUFHLFNBQVMs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LGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7WUFDekMsSUFBSSxXQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQyxXQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksV0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDMUMsV0FBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzthQUN6RTtTQUNGO2FBQU07WUFDTCxXQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3hFO0lBQ0gsQ0FBQzs7O0lBMUZVLFNBQVM7UUFIckIsVUFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQztPQUNXLFNBQVMsQ0EyRnJCO29CQWpHRDtDQWlHQyxBQTNGRCxJQTJGQztTQTNGWSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VERyb3BzLCBUT3BlbnN9IGZyb20gJy4uLy4uL3R5cGVzL3BvaXN0aW9ucy50eXBlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRG9tSGVscGVyIHtcblxuICBwcml2YXRlIHN0YXRpYyBzZXRZQXhpc1Bvc2l0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBhbmNob3I6IEhUTUxFbGVtZW50LCBkcm9wczogVERyb3BzKSB7XG4gICAgY29uc3QgYW5jaG9yUmVjdCA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGJvdHRvbSA9IGFuY2hvclJlY3QuYm90dG9tIC0gY29udGFpbmVyUmVjdC50b3A7XG4gICAgY29uc3QgdG9wID0gYW5jaG9yUmVjdC50b3AgLSBjb250YWluZXJSZWN0LnRvcDtcblxuICAgIGlmIChkcm9wcyA9PT0gJ2Rvd24nKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IChib3R0b20gKyAxICsgJ3B4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gKHRvcCAtIDEgLSBlbGVtZW50LnNjcm9sbEhlaWdodCkgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHNldFhBeGlzUG9zaXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGFuY2hvcjogSFRNTEVsZW1lbnQsIGRpbUVsZW06IEhUTUxFbGVtZW50LCBvcGVuczogVE9wZW5zKSB7XG4gICAgY29uc3QgYW5jaG9yUmVjdCA9IGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxlZnQgPSBhbmNob3JSZWN0LmxlZnQgLSBjb250YWluZXJSZWN0LmxlZnQ7XG5cbiAgICBpZiAob3BlbnMgPT09ICdyaWdodCcpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0IC0gZGltRWxlbS5vZmZzZXRXaWR0aCArIGFuY2hvci5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaXNUb3BJblZpZXcoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgY29uc3Qge3RvcH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKHRvcCA+PSAwKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGlzQm90dG9tSW5WaWV3KGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtib3R0b219ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChib3R0b20gPD0gd2luZG93LmlubmVySGVpZ2h0KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGlzTGVmdEluVmlldyhlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBjb25zdCB7bGVmdH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKGxlZnQgPj0gMCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBpc1JpZ2h0SW5WaWV3KGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtyaWdodH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKHJpZ2h0IDw9IHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgfVxuXG4gIGFwcGVuZEVsZW1lbnRUb1Bvc2l0aW9uKGNvbmZpZzogSUFwcGVuZFRvQXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHtjb250YWluZXIsIGVsZW1lbnR9ID0gY29uZmlnO1xuXG4gICAgaWYgKCFjb250YWluZXIuc3R5bGUucG9zaXRpb24gfHwgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudC5zdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJykge1xuICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgfVxuXG4gICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9KTtcbiAgfVxuXG4gIHNldEVsZW1lbnRQb3NpdGlvbih7ZWxlbWVudCwgY29udGFpbmVyLCBhbmNob3IsIGRpbUVsZW0sIGRyb3BzLCBvcGVuc306IElBcHBlbmRUb0FyZ3MpIHtcbiAgICBEb21IZWxwZXIuc2V0WUF4aXNQb3NpdGlvbihlbGVtZW50LCBjb250YWluZXIsIGFuY2hvciwgJ2Rvd24nKTtcbiAgICBEb21IZWxwZXIuc2V0WEF4aXNQb3NpdGlvbihlbGVtZW50LCBjb250YWluZXIsIGFuY2hvciwgZGltRWxlbSwgJ3JpZ2h0Jyk7XG5cbiAgICBpZiAoZHJvcHMgIT09ICdkb3duJyAmJiBkcm9wcyAhPT0gJ3VwJykge1xuICAgICAgaWYgKERvbUhlbHBlci5pc0JvdHRvbUluVmlldyhkaW1FbGVtKSkge1xuICAgICAgICBEb21IZWxwZXIuc2V0WUF4aXNQb3NpdGlvbihlbGVtZW50LCBjb250YWluZXIsIGFuY2hvciwgJ2Rvd24nKTtcbiAgICAgIH0gZWxzZSBpZiAoRG9tSGVscGVyLmlzVG9wSW5WaWV3KGRpbUVsZW0pKSB7XG4gICAgICAgIERvbUhlbHBlci5zZXRZQXhpc1Bvc2l0aW9uKGVsZW1lbnQsIGNvbnRhaW5lciwgYW5jaG9yLCAndXAnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgRG9tSGVscGVyLnNldFlBeGlzUG9zaXRpb24oZWxlbWVudCwgY29udGFpbmVyLCBhbmNob3IsIGRyb3BzKTtcbiAgICB9XG5cbiAgICBpZiAob3BlbnMgIT09ICdsZWZ0JyAmJiBvcGVucyAhPT0gJ3JpZ2h0Jykge1xuICAgICAgaWYgKERvbUhlbHBlci5pc1JpZ2h0SW5WaWV3KGRpbUVsZW0pKSB7XG4gICAgICAgIERvbUhlbHBlci5zZXRYQXhpc1Bvc2l0aW9uKGVsZW1lbnQsIGNvbnRhaW5lciwgYW5jaG9yLCBkaW1FbGVtLCAncmlnaHQnKTtcbiAgICAgIH0gZWxzZSBpZiAoRG9tSGVscGVyLmlzTGVmdEluVmlldyhkaW1FbGVtKSkge1xuICAgICAgICBEb21IZWxwZXIuc2V0WEF4aXNQb3NpdGlvbihlbGVtZW50LCBjb250YWluZXIsIGFuY2hvciwgZGltRWxlbSwgJ2xlZnQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgRG9tSGVscGVyLnNldFhBeGlzUG9zaXRpb24oZWxlbWVudCwgY29udGFpbmVyLCBhbmNob3IsIGRpbUVsZW0sIG9wZW5zKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXBwZW5kVG9BcmdzIHtcbiAgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIGFuY2hvcjogSFRNTEVsZW1lbnQ7XG4gIGRpbUVsZW06IEhUTUxFbGVtZW50O1xuICBkcm9wczogVERyb3BzO1xuICBvcGVuczogVE9wZW5zO1xufVxuIl19