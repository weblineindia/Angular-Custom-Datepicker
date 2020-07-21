import { __decorate } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MonthCalendarService } from './month-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var moment = momentNs;
var MonthCalendarComponent = /** @class */ (function () {
    function MonthCalendarComponent(monthCalendarService, utilsService, cd) {
        this.monthCalendarService = monthCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.isInited = false;
        this._shouldShowCurrent = true;
        this.api = {
            toggleCalendar: this.toggleCalendarMode.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    MonthCalendarComponent_1 = MonthCalendarComponent;
    Object.defineProperty(MonthCalendarComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.onChangeCallback(this.processOnChangeCallback(selected));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonthCalendarComponent.prototype, "currentDateView", {
        get: function () {
            return this._currentDateView;
        },
        set: function (current) {
            this._currentDateView = current.clone();
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this._currentDateView, this.selected);
            this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView);
            this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
            this.showRightNav = this.monthCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
            this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation && this.showLeftNav;
            this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation && this.showRightNav;
        },
        enumerable: true,
        configurable: true
    });
    MonthCalendarComponent.prototype.ngOnInit = function () {
        this.isInited = true;
        this.init();
        this.initValidators();
    };
    MonthCalendarComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInited) {
            var minDate = changes.minDate, maxDate = changes.maxDate, config = changes.config;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    };
    MonthCalendarComponent.prototype.init = function () {
        this.componentConfig = this.monthCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.displayDate
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this._shouldShowCurrent = this.shouldShowCurrent();
    };
    MonthCalendarComponent.prototype.writeValue = function (value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
        }
        this.cd.markForCheck();
    };
    MonthCalendarComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    MonthCalendarComponent.prototype.onChangeCallback = function (_) {
    };
    MonthCalendarComponent.prototype.registerOnTouched = function (fn) {
    };
    MonthCalendarComponent.prototype.validate = function (formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return function () { return null; };
        }
    };
    MonthCalendarComponent.prototype.processOnChangeCallback = function (value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    };
    MonthCalendarComponent.prototype.initValidators = function () {
        this.validateFn = this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'month');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    };
    MonthCalendarComponent.prototype.monthClicked = function (month) {
        if (month.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, month, 'month');
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(month);
    };
    MonthCalendarComponent.prototype.onLeftNavClick = function () {
        var from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(1, 'year');
        var to = this.currentDateView.clone();
        this.yearMonths = this.monthCalendarService.generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onLeftNav.emit({ from: from, to: to });
    };
    MonthCalendarComponent.prototype.onLeftSecondaryNavClick = function () {
        var navigateBy = this.componentConfig.multipleYearsNavigateBy;
        var isOutsideRange = this.componentConfig.min &&
            this.currentDateView.year() - this.componentConfig.min.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.currentDateView.year() - this.componentConfig.min.year();
        }
        var from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(navigateBy, 'year');
        var to = this.currentDateView.clone();
        this.onLeftSecondaryNav.emit({ from: from, to: to });
    };
    MonthCalendarComponent.prototype.onRightNavClick = function () {
        var from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(1, 'year');
        var to = this.currentDateView.clone();
        this.onRightNav.emit({ from: from, to: to });
    };
    MonthCalendarComponent.prototype.onRightSecondaryNavClick = function () {
        var navigateBy = this.componentConfig.multipleYearsNavigateBy;
        var isOutsideRange = this.componentConfig.max &&
            this.componentConfig.max.year() - this.currentDateView.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.componentConfig.max.year() - this.currentDateView.year();
        }
        var from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(navigateBy, 'year');
        var to = this.currentDateView.clone();
        this.onRightSecondaryNav.emit({ from: from, to: to });
    };
    MonthCalendarComponent.prototype.toggleCalendarMode = function () {
        this.onNavHeaderBtnClick.emit();
    };
    MonthCalendarComponent.prototype.getMonthBtnCssClass = function (month) {
        var cssClass = {
            'dp-selected': month.selected,
            'dp-current-month': month.currentMonth
        };
        var customCssClass = this.monthCalendarService.getMonthBtnCssClass(this.componentConfig, month.date);
        if (customCssClass) {
            cssClass[customCssClass] = true;
        }
        return cssClass;
    };
    MonthCalendarComponent.prototype.shouldShowCurrent = function () {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'month', this.componentConfig.min, this.componentConfig.max);
    };
    MonthCalendarComponent.prototype.goToCurrent = function () {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    };
    MonthCalendarComponent.prototype.moveCalendarTo = function (to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
            this.cd.markForCheck();
        }
    };
    MonthCalendarComponent.prototype.handleConfigChange = function (config) {
        if (config) {
            var prevConf = this.monthCalendarService.getConfig(config.previousValue);
            var currentConf_1 = this.monthCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf_1)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf_1.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf_1.locale);
                }
                (this.selected || []).forEach(function (m) { return m.locale(currentConf_1.locale); });
            }
        }
    };
    var MonthCalendarComponent_1;
    MonthCalendarComponent.ctorParameters = function () { return [
        { type: MonthCalendarService },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], MonthCalendarComponent.prototype, "config", void 0);
    __decorate([
        Input()
    ], MonthCalendarComponent.prototype, "displayDate", void 0);
    __decorate([
        Input()
    ], MonthCalendarComponent.prototype, "minDate", void 0);
    __decorate([
        Input()
    ], MonthCalendarComponent.prototype, "maxDate", void 0);
    __decorate([
        HostBinding('class'), Input()
    ], MonthCalendarComponent.prototype, "theme", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onSelect", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onNavHeaderBtnClick", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onGoToCurrent", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onLeftNav", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onRightNav", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onLeftSecondaryNav", void 0);
    __decorate([
        Output()
    ], MonthCalendarComponent.prototype, "onRightSecondaryNav", void 0);
    MonthCalendarComponent = MonthCalendarComponent_1 = __decorate([
        Component({
            selector: 'dp-month-calendar',
            template: "<div class=\"dp-month-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode()\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onLeftSecondaryNav)=\"onLeftSecondaryNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      (onRightSecondaryNav)=\"onRightSecondaryNavClick()\"\n      [isLabelClickable]=\"componentConfig.isNavHeaderBtnClickable\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"shouldShowCurrent()\"\n      [showLeftNav]=\"showLeftNav\"\n      [showLeftSecondaryNav]=\"showSecondaryLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [showRightSecondaryNav]=\"showSecondaryRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div class=\"dp-calendar-wrapper\">\n    <div *ngFor=\"let monthRow of yearMonths\" class=\"dp-months-row\">\n      <button (click)=\"monthClicked(month)\"\n              *ngFor=\"let month of monthRow\"\n              [attr.data-date]=\"month.date.format(componentConfig.format)\"\n              [disabled]=\"month.disabled\"\n              [innerText]=\"month.text\"\n              [ngClass]=\"getMonthBtnCssClass(month)\"\n              class=\"dp-calendar-month\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [
                MonthCalendarService,
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return MonthCalendarComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return MonthCalendarComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-month-calendar{display:inline-block}dp-month-calendar .dp-month-calendar-container{background:#fff}dp-month-calendar .dp-calendar-wrapper{border:1px solid #000}dp-month-calendar .dp-calendar-month{box-sizing:border-box;width:52.5px;height:52.5px;cursor:pointer}dp-month-calendar .dp-calendar-month.dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-calendar-weekday{height:25px;width:30px;line-height:25px;background:#e0e0e0;border:1px solid #e0e0e0}dp-month-calendar.dp-material .dp-calendar-wrapper{border:1px solid #e0e0e0}dp-month-calendar.dp-material .dp-calendar-month{box-sizing:border-box;background:#fff;border-radius:50%;border:none;outline:0}dp-month-calendar.dp-material .dp-calendar-month:hover{background:#e0e0e0}dp-month-calendar.dp-material .dp-selected{background:#106cc8;color:#fff}dp-month-calendar.dp-material .dp-selected:hover{background:#106cc8}dp-month-calendar.dp-material .dp-current-month{border:1px solid #106cc8}"]
        })
    ], MonthCalendarComponent);
    return MonthCalendarComponent;
}());
export { MonthCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsibW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksRUFDWixhQUFhLEVBQ2IsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzlELE9BQU8sS0FBSyxRQUFRLE1BQU0sUUFBUSxDQUFDO0FBR25DLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBR2xCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBS3BFLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQXNCeEI7SUEwREUsZ0NBQTRCLG9CQUEwQyxFQUMxQyxZQUEwQixFQUMxQixFQUFxQjtRQUZyQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBN0J2QyxhQUFRLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDcEQsd0JBQW1CLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0Qsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2RCxjQUFTLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDeEQsZUFBVSxHQUE0QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELHVCQUFrQixHQUE0QixJQUFJLFlB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QW1CO1lBQzdCLG94Q0FBNEM7WUFFNUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7WUFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsU0FBUyxFQUFFO2dCQUNULG9CQUFvQjtnQkFDcEI7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsd0JBQXNCLEVBQXRCLENBQXNCLENBQUM7b0JBQ3JELEtBQUssRUFBRSxJQUFJO2lCQUNaO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxhQUFhO29CQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSx3QkFBc0IsRUFBdEIsQ0FBc0IsQ0FBQztvQkFDckQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjs7U0FDRixDQUFDO09BQ1csc0JBQXNCLENBMFFsQztJQUFELDZCQUFDO0NBQUEsQUExUUQsSUEwUUM7U0ExUVksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlLWVudW0nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtJTW9udGh9IGZyb20gJy4vbW9udGgubW9kZWwnO1xuaW1wb3J0IHtNb250aENhbGVuZGFyU2VydmljZX0gZnJvbSAnLi9tb250aC1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIG1vbWVudE5zIGZyb20gJ21vbWVudCc7XG5pbXBvcnQge01vbWVudH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7SU1vbnRoQ2FsZW5kYXJDb25maWcsIElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vbW9udGgtY2FsZW5kYXItY29uZmlnJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtEYXRlVmFsaWRhdG9yfSBmcm9tICcuLi9jb21tb24vdHlwZXMvdmFsaWRhdG9yLnR5cGUnO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnROcztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHAtbW9udGgtY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudC5sZXNzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICBNb250aENhbGVuZGFyU2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1vbnRoQ2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNb250aENhbGVuZGFyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1vbnRoQ2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZCkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnREYXRlVmlldygpOiBNb21lbnQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50RGF0ZVZpZXc7XG4gIH1cblxuICBzZXQgY3VycmVudERhdGVWaWV3KGN1cnJlbnQ6IE1vbWVudCkge1xuICAgIHRoaXMuX2N1cnJlbnREYXRlVmlldyA9IGN1cnJlbnQuY2xvbmUoKTtcbiAgICB0aGlzLnllYXJNb250aHMgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVZZWFyKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMubmF2TGFiZWwgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLmdldEhlYWRlckxhYmVsKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93TGVmdE5hdiA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2Uuc2hvdWxkU2hvd0xlZnQodGhpcy5jb21wb25lbnRDb25maWcubWluLCB0aGlzLl9jdXJyZW50RGF0ZVZpZXcpO1xuICAgIHRoaXMuc2hvd1JpZ2h0TmF2ID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5zaG91bGRTaG93UmlnaHQodGhpcy5jb21wb25lbnRDb25maWcubWF4LCB0aGlzLmN1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93U2Vjb25kYXJ5TGVmdE5hdiA9IHRoaXMuY29tcG9uZW50Q29uZmlnLnNob3dNdWx0aXBsZVllYXJzTmF2aWdhdGlvbiAmJiB0aGlzLnNob3dMZWZ0TmF2O1xuICAgIHRoaXMuc2hvd1NlY29uZGFyeVJpZ2h0TmF2ID0gdGhpcy5jb21wb25lbnRDb25maWcuc2hvd011bHRpcGxlWWVhcnNOYXZpZ2F0aW9uICYmIHRoaXMuc2hvd1JpZ2h0TmF2O1xuICB9XG5cbiAgQElucHV0KCkgY29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZztcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IE1vbWVudDtcbiAgQElucHV0KCkgbWluRGF0ZTogTW9tZW50O1xuICBASW5wdXQoKSBtYXhEYXRlOiBNb21lbnQ7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxJTW9udGg+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25OYXZIZWFkZXJCdG5DbGljazogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0U2Vjb25kYXJ5TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBpc0luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb21wb25lbnRDb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWw7XG4gIHllYXJNb250aHM6IElNb250aFtdW107XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlucHV0VmFsdWVUeXBlOiBFQ2FsZW5kYXJWYWx1ZTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgX3Nob3VsZFNob3dDdXJyZW50OiBib29sZWFuID0gdHJ1ZTtcbiAgbmF2TGFiZWw6IHN0cmluZztcbiAgc2hvd0xlZnROYXY6IGJvb2xlYW47XG4gIHNob3dSaWdodE5hdjogYm9vbGVhbjtcbiAgc2hvd1NlY29uZGFyeUxlZnROYXY6IGJvb2xlYW47XG4gIHNob3dTZWNvbmRhcnlSaWdodE5hdjogYm9vbGVhbjtcbiAgYXBpID0ge1xuICAgIHRvZ2dsZUNhbGVuZGFyOiB0aGlzLnRvZ2dsZUNhbGVuZGFyTW9kZS5iaW5kKHRoaXMpLFxuICAgIG1vdmVDYWxlbmRhclRvOiB0aGlzLm1vdmVDYWxlbmRhclRvLmJpbmQodGhpcylcbiAgfTtcblxuICBfc2VsZWN0ZWQ6IE1vbWVudFtdO1xuICBfY3VycmVudERhdGVWaWV3OiBNb21lbnQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1vbnRoQ2FsZW5kYXJTZXJ2aWNlOiBNb250aENhbGVuZGFyU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbml0ZWQpIHtcbiAgICAgIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlLCBjb25maWd9ID0gY2hhbmdlcztcblxuICAgICAgdGhpcy5oYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkIHx8IFtdO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5kaXNwbGF5RGF0ZVxuICAgICAgPyB0aGlzLmRpc3BsYXlEYXRlXG4gICAgICA6IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApO1xuICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0KTtcbiAgICB0aGlzLl9zaG91bGRTaG93Q3VycmVudCA9IHRoaXMuc2hvdWxkU2hvd0N1cnJlbnQoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IENhbGVuZGFyVmFsdWUpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5jb252ZXJ0VG9Nb21lbnRBcnJheSh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgICAgdGhpcy55ZWFyTW9udGhzID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZVxuICAgICAgICAuZ2VuZXJhdGVZZWFyKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHRoaXMueWVhck1vbnRocyA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2VcbiAgICAgICAgLmdlbmVyYXRlWWVhcih0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55KTogdm9pZCB7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gIH1cblxuICB2YWxpZGF0ZShmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgYW55IHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKSA9PiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHZhbHVlOiBNb21lbnRbXSk6IENhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgdmFsdWUsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5yZXR1cm5lZFZhbHVlVHlwZSB8fCB0aGlzLmlucHV0VmFsdWVUeXBlXG4gICAgKTtcbiAgfVxuXG4gIGluaXRWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZVZhbGlkYXRvcihcbiAgICAgIHttaW5EYXRlOiB0aGlzLm1pbkRhdGUsIG1heERhdGU6IHRoaXMubWF4RGF0ZX0sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICAnbW9udGgnXG4gICAgKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIG1vbnRoQ2xpY2tlZChtb250aDogSU1vbnRoKTogdm9pZCB7XG4gICAgaWYgKG1vbnRoLnNlbGVjdGVkICYmICF0aGlzLmNvbXBvbmVudENvbmZpZy51blNlbGVjdE9uQ2xpY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgIC51cGRhdGVTZWxlY3RlZCh0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LCB0aGlzLnNlbGVjdGVkLCBtb250aCwgJ21vbnRoJyk7XG4gICAgdGhpcy55ZWFyTW9udGhzID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlWWVhcih0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5jdXJyZW50RGF0ZVZpZXcsIHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMub25TZWxlY3QuZW1pdChtb250aCk7XG4gIH1cblxuICBvbkxlZnROYXZDbGljaygpIHtcbiAgICBjb25zdCBmcm9tID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCkuc3VidHJhY3QoMSwgJ3llYXInKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy55ZWFyTW9udGhzID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5nZW5lcmF0ZVllYXIodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KHtmcm9tLCB0b30pO1xuICB9XG5cbiAgb25MZWZ0U2Vjb25kYXJ5TmF2Q2xpY2soKTogdm9pZCB7XG4gICAgbGV0IG5hdmlnYXRlQnkgPSB0aGlzLmNvbXBvbmVudENvbmZpZy5tdWx0aXBsZVllYXJzTmF2aWdhdGVCeTtcbiAgICBjb25zdCBpc091dHNpZGVSYW5nZSA9IHRoaXMuY29tcG9uZW50Q29uZmlnLm1pbiAmJlxuICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcueWVhcigpIC0gdGhpcy5jb21wb25lbnRDb25maWcubWluLnllYXIoKSA8IG5hdmlnYXRlQnk7XG5cbiAgICBpZiAoaXNPdXRzaWRlUmFuZ2UpIHtcbiAgICAgIG5hdmlnYXRlQnkgPSB0aGlzLmN1cnJlbnREYXRlVmlldy55ZWFyKCkgLSB0aGlzLmNvbXBvbmVudENvbmZpZy5taW4ueWVhcigpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKS5zdWJ0cmFjdChuYXZpZ2F0ZUJ5LCAneWVhcicpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uTGVmdFNlY29uZGFyeU5hdi5lbWl0KHtmcm9tLCB0b30pO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKS5hZGQoMSwgJ3llYXInKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvblJpZ2h0U2Vjb25kYXJ5TmF2Q2xpY2soKTogdm9pZCB7XG4gICAgbGV0IG5hdmlnYXRlQnkgPSB0aGlzLmNvbXBvbmVudENvbmZpZy5tdWx0aXBsZVllYXJzTmF2aWdhdGVCeTtcbiAgICBjb25zdCBpc091dHNpZGVSYW5nZSA9IHRoaXMuY29tcG9uZW50Q29uZmlnLm1heCAmJlxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWF4LnllYXIoKSAtIHRoaXMuY3VycmVudERhdGVWaWV3LnllYXIoKSA8IG5hdmlnYXRlQnk7XG5cbiAgICBpZiAoaXNPdXRzaWRlUmFuZ2UpIHtcbiAgICAgIG5hdmlnYXRlQnkgPSB0aGlzLmNvbXBvbmVudENvbmZpZy5tYXgueWVhcigpIC0gdGhpcy5jdXJyZW50RGF0ZVZpZXcueWVhcigpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKS5hZGQobmF2aWdhdGVCeSwgJ3llYXInKTtcbiAgICBjb25zdCB0byA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5vblJpZ2h0U2Vjb25kYXJ5TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhck1vZGUoKTogdm9pZCB7XG4gICAgdGhpcy5vbk5hdkhlYWRlckJ0bkNsaWNrLmVtaXQoKTtcbiAgfVxuXG4gIGdldE1vbnRoQnRuQ3NzQ2xhc3MobW9udGg6IElNb250aCk6IHtba2xhc3M6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgICBjb25zdCBjc3NDbGFzczoge1trbGFzczogc3RyaW5nXTogYm9vbGVhbn0gPSB7XG4gICAgICAnZHAtc2VsZWN0ZWQnOiBtb250aC5zZWxlY3RlZCxcbiAgICAgICdkcC1jdXJyZW50LW1vbnRoJzogbW9udGguY3VycmVudE1vbnRoXG4gICAgfTtcbiAgICBjb25zdCBjdXN0b21Dc3NDbGFzczogc3RyaW5nID0gdGhpcy5tb250aENhbGVuZGFyU2VydmljZS5nZXRNb250aEJ0bkNzc0NsYXNzKHRoaXMuY29tcG9uZW50Q29uZmlnLCBtb250aC5kYXRlKTtcblxuICAgIGlmIChjdXN0b21Dc3NDbGFzcykge1xuICAgICAgY3NzQ2xhc3NbY3VzdG9tQ3NzQ2xhc3NdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3NzQ2xhc3M7XG4gIH1cblxuICBzaG91bGRTaG93Q3VycmVudCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2Uuc2hvdWxkU2hvd0N1cnJlbnQoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5zaG93R29Ub0N1cnJlbnQsXG4gICAgICAnbW9udGgnLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWF4XG4gICAgKTtcbiAgfVxuXG4gIGdvVG9DdXJyZW50KCk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50KCk7XG4gICAgdGhpcy5vbkdvVG9DdXJyZW50LmVtaXQoKTtcbiAgfVxuXG4gIG1vdmVDYWxlbmRhclRvKHRvOiBTaW5nbGVDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgaWYgKHRvKSB7XG4gICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0bywgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KTtcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ29uZmlnQ2hhbmdlKGNvbmZpZzogU2ltcGxlQ2hhbmdlKTogdm9pZCB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgY29uc3QgcHJldkNvbmY6IElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLm1vbnRoQ2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcucHJldmlvdXNWYWx1ZSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29uZjogSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMubW9udGhDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5jdXJyZW50VmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy51dGlsc1NlcnZpY2Uuc2hvdWxkUmVzZXRDdXJyZW50VmlldyhwcmV2Q29uZiwgY3VycmVudENvbmYpKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnREYXRlVmlldyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2Q29uZi5sb2NhbGUgIT09IGN1cnJlbnRDb25mLmxvY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50RGF0ZVZpZXcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldy5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKVxuICAgICAgICB9XG5cbiAgICAgICAgKHRoaXMuc2VsZWN0ZWQgfHwgW10pLmZvckVhY2goKG0pID0+IG0ubG9jYWxlKGN1cnJlbnRDb25mLmxvY2FsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19