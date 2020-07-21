import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
var CalendarNavComponent = /** @class */ (function () {
    function CalendarNavComponent() {
        this.isLabelClickable = false;
        this.showLeftNav = true;
        this.showLeftSecondaryNav = false;
        this.showRightNav = true;
        this.showRightSecondaryNav = false;
        this.leftNavDisabled = false;
        this.leftSecondaryNavDisabled = false;
        this.rightNavDisabled = false;
        this.rightSecondaryNavDisabled = false;
        this.showGoToCurrent = true;
        this.onLeftNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.onLabelClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
    }
    CalendarNavComponent.prototype.leftNavClicked = function () {
        this.onLeftNav.emit();
    };
    CalendarNavComponent.prototype.leftSecondaryNavClicked = function () {
        this.onLeftSecondaryNav.emit();
    };
    CalendarNavComponent.prototype.rightNavClicked = function () {
        this.onRightNav.emit();
    };
    CalendarNavComponent.prototype.rightSecondaryNavClicked = function () {
        this.onRightSecondaryNav.emit();
    };
    CalendarNavComponent.prototype.labelClicked = function () {
        this.onLabelClick.emit();
    };
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "label", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "isLabelClickable", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "showLeftNav", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "showLeftSecondaryNav", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "showRightNav", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "showRightSecondaryNav", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "leftNavDisabled", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "leftSecondaryNavDisabled", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "rightNavDisabled", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "rightSecondaryNavDisabled", void 0);
    __decorate([
        Input()
    ], CalendarNavComponent.prototype, "showGoToCurrent", void 0);
    __decorate([
        HostBinding('class'), Input()
    ], CalendarNavComponent.prototype, "theme", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onLeftNav", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onLeftSecondaryNav", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onRightNav", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onRightSecondaryNav", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onLabelClick", void 0);
    __decorate([
        Output()
    ], CalendarNavComponent.prototype, "onGoToCurrent", void 0);
    CalendarNavComponent = __decorate([
        Component({
            selector: 'dp-calendar-nav',
            template: "<div class=\"dp-calendar-nav-container\">\n  <div class=\"dp-nav-header\">\n    <span [attr.data-hidden]=\"isLabelClickable\"\n          [hidden]=\"isLabelClickable\"\n          [innerText]=\"label\">\n    </span>\n    <button (click)=\"labelClicked()\"\n            [attr.data-hidden]=\"!isLabelClickable\"\n            [hidden]=\"!isLabelClickable\"\n            [innerText]=\"label\"\n            class=\"dp-nav-header-btn\"\n            type=\"button\">\n    </button>\n  </div>\n\n  <div class=\"dp-nav-btns-container\">\n    <div class=\"dp-calendar-nav-container-left\">\n      <button (click)=\"leftSecondaryNavClicked()\"\n              *ngIf=\"showLeftSecondaryNav\"\n              [disabled]=\"leftSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-left\"\n              type=\"button\">\n      </button>\n      <button (click)=\"leftNavClicked()\"\n              [attr.data-hidden]=\"!showLeftNav\"\n              [disabled]=\"leftNavDisabled\"\n              [hidden]=\"!showLeftNav\"\n              class=\"dp-calendar-nav-left\"\n              type=\"button\">\n      </button>\n    </div>\n    <button (click)=\"onGoToCurrent.emit()\"\n            *ngIf=\"showGoToCurrent\"\n            class=\"dp-current-location-btn\"\n            type=\"button\">\n    </button>\n    <div class=\"dp-calendar-nav-container-right\">\n      <button (click)=\"rightNavClicked()\"\n              [attr.data-hidden]=\"!showRightNav\"\n              [disabled]=\"rightNavDisabled\"\n              [hidden]=\"!showRightNav\"\n              class=\"dp-calendar-nav-right\"\n              type=\"button\">\n      </button>\n      <button (click)=\"rightSecondaryNavClicked()\"\n              *ngIf=\"showRightSecondaryNav\"\n              [disabled]=\"rightSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-right\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: ["dp-calendar-nav .dp-calendar-nav-container{position:relative;box-sizing:border-box;height:25px;border:1px solid #000;border-bottom:none}dp-calendar-nav .dp-nav-date-btn{box-sizing:border-box;height:25px;border:1px solid #000;border-bottom:none}dp-calendar-nav .dp-nav-btns-container{position:absolute;top:50%;transform:translateY(-50%);right:5px;display:inline-block}dp-calendar-nav .dp-calendar-nav-container-left,dp-calendar-nav .dp-calendar-nav-container-right{display:inline-block}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right,dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{position:relative;width:16px;cursor:pointer}dp-calendar-nav .dp-calendar-nav-left,dp-calendar-nav .dp-calendar-nav-right{line-height:0}dp-calendar-nav .dp-calendar-nav-left::before,dp-calendar-nav .dp-calendar-nav-right::before{position:relative;content:'';display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left,dp-calendar-nav .dp-calendar-secondary-nav-right{padding:0}dp-calendar-nav .dp-calendar-secondary-nav-left::after,dp-calendar-nav .dp-calendar-secondary-nav-left::before,dp-calendar-nav .dp-calendar-secondary-nav-right::after,dp-calendar-nav .dp-calendar-secondary-nav-right::before{position:relative;content:'';display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(45deg)}dp-calendar-nav .dp-calendar-secondary-nav-left::before,dp-calendar-nav .dp-calendar-secondary-nav-right::before{right:-10px}dp-calendar-nav .dp-calendar-secondary-nav-right{left:initial;right:5px}dp-calendar-nav .dp-calendar-nav-left::before,dp-calendar-nav .dp-calendar-secondary-nav-left::after,dp-calendar-nav .dp-calendar-secondary-nav-left::before{position:relative;content:'';display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0;transform:rotate(-135deg)}dp-calendar-nav .dp-calendar-secondary-nav-left::before{right:-10px}dp-calendar-nav .dp-nav-header{position:absolute;top:50%;transform:translateY(-50%);left:5px;display:inline-block;font-size:13px}dp-calendar-nav .dp-nav-header-btn{cursor:pointer}dp-calendar-nav .dp-current-location-btn{position:relative;top:-1px;height:16px;width:16px;vertical-align:middle;background:rgba(0,0,0,.6);border:1px solid rgba(0,0,0,.6);outline:0;border-radius:50%;box-shadow:inset 0 0 0 3px #fff;cursor:pointer}dp-calendar-nav .dp-current-location-btn:hover{background:#000}dp-calendar-nav.dp-material .dp-calendar-nav-container{height:30px;border:1px solid #e0e0e0}dp-calendar-nav.dp-material .dp-calendar-nav-left,dp-calendar-nav.dp-material .dp-calendar-nav-right,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{border:none;background:#fff;outline:0;font-size:16px;padding:0}dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right{width:20px}dp-calendar-nav.dp-material .dp-nav-header-btn{height:20px;width:80px;border:none;background:#fff;outline:0}dp-calendar-nav.dp-material .dp-nav-header-btn:hover{background:rgba(0,0,0,.05)}dp-calendar-nav.dp-material .dp-nav-header-btn:active{background:rgba(0,0,0,.1)}"]
        })
    ], CalendarNavComponent);
    return CalendarNavComponent;
}());
export { CalendarNavComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbmF2LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImNhbGVuZGFyLW5hdi9jYWxlbmRhci1uYXYuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBU3ZCO0lBQUE7UUFFVyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFDNUIseUJBQW9CLEdBQVksS0FBSyxDQUFDO1FBQ3RDLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBQzdCLDBCQUFxQixHQUFZLEtBQUssQ0FBQztRQUN2QyxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyw2QkFBd0IsR0FBWSxLQUFLLENBQUM7UUFDMUMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLDhCQUF5QixHQUFZLEtBQUssQ0FBQztRQUMzQyxvQkFBZSxHQUFZLElBQUksQ0FBQztRQUcvQixjQUFTLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkQsdUJBQWtCLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3BELHdCQUFtQixHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdELGlCQUFZLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQXFCbkUsQ0FBQztJQW5CQyw2Q0FBYyxHQUFkO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsc0RBQXVCLEdBQXZCO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCw4Q0FBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsdURBQXdCLEdBQXhCO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCwyQ0FBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBdENRO1FBQVIsS0FBSyxFQUFFO3VEQUFlO0lBQ2Q7UUFBUixLQUFLLEVBQUU7a0VBQW1DO0lBQ2xDO1FBQVIsS0FBSyxFQUFFOzZEQUE2QjtJQUM1QjtRQUFSLEtBQUssRUFBRTtzRUFBdUM7SUFDdEM7UUFBUixLQUFLLEVBQUU7OERBQThCO0lBQzdCO1FBQVIsS0FBSyxFQUFFO3VFQUF3QztJQUN2QztRQUFSLEtBQUssRUFBRTtpRUFBa0M7SUFDakM7UUFBUixLQUFLLEVBQUU7MEVBQTJDO0lBQzFDO1FBQVIsS0FBSyxFQUFFO2tFQUFtQztJQUNsQztRQUFSLEtBQUssRUFBRTsyRUFBNEM7SUFDM0M7UUFBUixLQUFLLEVBQUU7aUVBQWlDO0lBQ1Y7UUFBOUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRTt1REFBZTtJQUVuQztRQUFULE1BQU0sRUFBRTsyREFBb0Q7SUFDbkQ7UUFBVCxNQUFNLEVBQUU7b0VBQTZEO0lBQzVEO1FBQVQsTUFBTSxFQUFFOzREQUFxRDtJQUNwRDtRQUFULE1BQU0sRUFBRTtxRUFBOEQ7SUFDN0Q7UUFBVCxNQUFNLEVBQUU7OERBQXVEO0lBQ3REO1FBQVQsTUFBTSxFQUFFOytEQUF3RDtJQW5CdEQsb0JBQW9CO1FBUGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsdzVEQUE0QztZQUU1QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtZQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztPQUNXLG9CQUFvQixDQXdDaEM7SUFBRCwyQkFBQztDQUFBLEFBeENELElBd0NDO1NBeENZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1jYWxlbmRhci1uYXYnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItbmF2LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY2FsZW5kYXItbmF2LmNvbXBvbmVudC5sZXNzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTmF2Q29tcG9uZW50IHtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgaXNMYWJlbENsaWNrYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBzaG93TGVmdE5hdjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHNob3dMZWZ0U2Vjb25kYXJ5TmF2OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNob3dSaWdodE5hdjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHNob3dSaWdodFNlY29uZGFyeU5hdjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBsZWZ0TmF2RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgbGVmdFNlY29uZGFyeU5hdkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJpZ2h0TmF2RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcmlnaHRTZWNvbmRhcnlOYXZEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBzaG93R29Ub0N1cnJlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcblxuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8bnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGFiZWxDbGljazogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGxlZnROYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoKTtcbiAgfVxuXG4gIGxlZnRTZWNvbmRhcnlOYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25MZWZ0U2Vjb25kYXJ5TmF2LmVtaXQoKTtcbiAgfVxuXG4gIHJpZ2h0TmF2Q2xpY2tlZCgpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdCgpO1xuICB9XG5cbiAgcmlnaHRTZWNvbmRhcnlOYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25SaWdodFNlY29uZGFyeU5hdi5lbWl0KCk7XG4gIH1cblxuICBsYWJlbENsaWNrZWQoKSB7XG4gICAgdGhpcy5vbkxhYmVsQ2xpY2suZW1pdCgpO1xuICB9XG59XG4iXX0=