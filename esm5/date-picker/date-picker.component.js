import { __decorate } from "tslib";
import { DomHelper } from '../common/services/dom-appender/dom-appender.service';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DatePickerService } from './date-picker.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectEvent } from '../common/types/selection-event.enum';
var DatePickerComponent = /** @class */ (function () {
    function DatePickerComponent(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
        this.dayPickerService = dayPickerService;
        this.domHelper = domHelper;
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.utilsService = utilsService;
        this.cd = cd;
        this.isInitialized = false;
        this.mode = 'day';
        this.placeholder = '';
        this.disabled = false;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.hideStateHelper = false;
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListenersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
        this.selectEvent = SelectEvent;
        this._areCalendarsShown = false;
        this._selected = [];
    }
    DatePickerComponent_1 = DatePickerComponent;
    Object.defineProperty(DatePickerComponent.prototype, "openOnFocus", {
        get: function () {
            return this.componentConfig.openOnFocus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "openOnClick", {
        get: function () {
            return this.componentConfig.openOnClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "areCalendarsShown", {
        get: function () {
            return this._areCalendarsShown;
        },
        set: function (value) {
            if (value) {
                this.startGlobalListeners();
                this.domHelper.appendElementToPosition({
                    container: this.appendToElement,
                    element: this.calendarWrapper,
                    anchor: this.inputElementContainer,
                    dimElem: this.popupElem,
                    drops: this.componentConfig.drops,
                    opens: this.componentConfig.opens
                });
            }
            else {
                this.stopGlobalListeners();
                this.dayPickerService.pickerClosed();
            }
            this._areCalendarsShown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.inputElementValue = this.utilsService
                .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
                .join(' | ');
            var val = this.processOnChangeCallback(selected);
            this.onChangeCallback(val, false);
            this.onChange.emit(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerComponent.prototype, "currentDateView", {
        get: function () {
            return this._currentDateView;
        },
        set: function (date) {
            this._currentDateView = date;
            if (this.dayCalendarRef) {
                this.dayCalendarRef.moveCalendarTo(date);
            }
            if (this.monthCalendarRef) {
                this.monthCalendarRef.moveCalendarTo(date);
            }
            if (this.dayTimeCalendarRef) {
                this.dayTimeCalendarRef.moveCalendarTo(date);
            }
        },
        enumerable: true,
        configurable: true
    });
    DatePickerComponent.prototype.onClick = function () {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    };
    DatePickerComponent.prototype.onBodyClick = function () {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    };
    DatePickerComponent.prototype.onScroll = function () {
        if (this.areCalendarsShown) {
            this.domHelper.setElementPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
    };
    DatePickerComponent.prototype.writeValue = function (value) {
        this.inputValue = value;
        if (value || value === '') {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig);
            this.init();
        }
        else {
            this.selected = [];
        }
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DatePickerComponent.prototype.onChangeCallback = function (_, changedByInput) {
    };
    DatePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    DatePickerComponent.prototype.onTouchedCallback = function () {
    };
    DatePickerComponent.prototype.validate = function (formControl) {
        return this.validateFn(formControl.value);
    };
    DatePickerComponent.prototype.processOnChangeCallback = function (selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    };
    DatePickerComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    };
    DatePickerComponent.prototype.ngOnInit = function () {
        this.isInitialized = true;
        this.init();
    };
    DatePickerComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInitialized) {
            this.init();
        }
    };
    DatePickerComponent.prototype.ngAfterViewInit = function () {
        this.setElementPositionInDom();
    };
    DatePickerComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.setElementPositionInDom = function () {
        this.calendarWrapper = this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        var appendTo = this.componentConfig.appendTo;
        if (appendTo) {
            if (typeof appendTo === 'string') {
                this.appendToElement = document.querySelector(appendTo);
            }
            else {
                this.appendToElement = appendTo;
            }
        }
        else {
            this.appendToElement = this.elemRef.nativeElement;
        }
        this.appendToElement.appendChild(this.calendarWrapper);
    };
    DatePickerComponent.prototype.setInputElementContainer = function () {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    };
    DatePickerComponent.prototype.handleInnerElementClick = function (element) {
        var _this = this;
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', function () {
            _this.hideStateHelper = true;
        }));
    };
    DatePickerComponent.prototype.init = function () {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
        this.initValidators();
    };
    DatePickerComponent.prototype.inputFocused = function () {
        var _this = this;
        if (!this.openOnFocus) {
            return;
        }
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.isFocusedTrigger = true;
        this.onOpenDelayTimeoutHandler = setTimeout(function () {
            if (!_this.areCalendarsShown) {
                _this.showCalendars();
            }
            _this.hideStateHelper = false;
            _this.isFocusedTrigger = false;
            _this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    };
    DatePickerComponent.prototype.inputBlurred = function () {
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.onTouchedCallback();
    };
    DatePickerComponent.prototype.showCalendars = function () {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.hideCalendar = function () {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    };
    DatePickerComponent.prototype.onViewDateChange = function (value) {
        var strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
            this.onSelect.emit({
                date: strVal,
                type: SelectEvent.INPUT,
                granularity: null
            });
        }
        else {
            this._selected = this.utilsService
                .getValidMomentArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    };
    DatePickerComponent.prototype.dateSelected = function (date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity: granularity,
            type: type
        });
    };
    DatePickerComponent.prototype.onDateClick = function () {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    };
    DatePickerComponent.prototype.onKeyPress = function (event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    };
    DatePickerComponent.prototype.moveCalendarTo = function (date) {
        var momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    };
    DatePickerComponent.prototype.onLeftNavClick = function (change) {
        this.onLeftNav.emit(change);
    };
    DatePickerComponent.prototype.onRightNavClick = function (change) {
        this.onRightNav.emit(change);
    };
    DatePickerComponent.prototype.startGlobalListeners = function () {
        var _this = this;
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', function (e) {
            _this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', function () {
            _this.onScroll();
        }), this.renderer.listen(document, 'click', function () {
            _this.onBodyClick();
        }));
    };
    DatePickerComponent.prototype.stopGlobalListeners = function () {
        this.globalListenersUnlisteners.forEach(function (ul) { return ul(); });
        this.globalListenersUnlisteners = [];
    };
    DatePickerComponent.prototype.ngOnDestroy = function () {
        this.handleInnerElementClickUnlisteners.forEach(function (ul) { return ul(); });
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    };
    var DatePickerComponent_1;
    DatePickerComponent.ctorParameters = function () { return [
        { type: DatePickerService },
        { type: DomHelper },
        { type: ElementRef },
        { type: Renderer2 },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "config", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "mode", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "placeholder", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "disabled", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "displayDate", void 0);
    __decorate([
        HostBinding('class'), Input()
    ], DatePickerComponent.prototype, "theme", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "minDate", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "maxDate", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "minTime", void 0);
    __decorate([
        Input()
    ], DatePickerComponent.prototype, "maxTime", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "open", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "close", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "onChange", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "onGoToCurrent", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "onLeftNav", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "onRightNav", void 0);
    __decorate([
        Output()
    ], DatePickerComponent.prototype, "onSelect", void 0);
    __decorate([
        ViewChild('container')
    ], DatePickerComponent.prototype, "calendarContainer", void 0);
    __decorate([
        ViewChild('dayCalendar')
    ], DatePickerComponent.prototype, "dayCalendarRef", void 0);
    __decorate([
        ViewChild('monthCalendar')
    ], DatePickerComponent.prototype, "monthCalendarRef", void 0);
    __decorate([
        ViewChild('daytimeCalendar')
    ], DatePickerComponent.prototype, "dayTimeCalendarRef", void 0);
    __decorate([
        ViewChild('timeSelect')
    ], DatePickerComponent.prototype, "timeSelectRef", void 0);
    __decorate([
        HostListener('click')
    ], DatePickerComponent.prototype, "onClick", null);
    __decorate([
        HostListener('window:resize')
    ], DatePickerComponent.prototype, "onScroll", null);
    DatePickerComponent = DatePickerComponent_1 = __decorate([
        Component({
            selector: 'dp-date-picker',
            template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\">\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <div #container>\n    <div [attr.data-hidden]=\"!_areCalendarsShown\"\n         [hidden]=\"!_areCalendarsShown\"\n         [ngSwitch]=\"mode\"\n         class=\"dp-popup {{theme}}\">\n      <dp-day-calendar #dayCalendar\n                       (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                       (onLeftNav)=\"onLeftNavClick($event)\"\n                       (onRightNav)=\"onRightNavClick($event)\"\n                       (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                       *ngSwitchCase=\"'day'\"\n                       [config]=\"dayCalendarConfig\"\n                       [displayDate]=\"displayDate\"\n                       [ngModel]=\"_selected\"\n                       [theme]=\"theme\">\n      </dp-day-calendar>\n\n      <dp-month-calendar #monthCalendar\n                         (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'month'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n      </dp-month-calendar>\n\n      <dp-time-select #timeSelect\n                      (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                      *ngSwitchCase=\"'time'\"\n                      [config]=\"timeSelectConfig\"\n                      [ngModel]=\"_selected && _selected[0]\"\n                      [theme]=\"theme\">\n      </dp-time-select>\n\n      <dp-day-time-calendar #daytimeCalendar\n                            (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                            (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                            (onLeftNav)=\"onLeftNavClick($event)\"\n                            (onRightNav)=\"onRightNavClick($event)\"\n                            *ngSwitchCase=\"'daytime'\"\n                            [config]=\"dayTimeCalendarConfig\"\n                            [displayDate]=\"displayDate\"\n                            [ngModel]=\"_selected && _selected[0]\"\n                            [theme]=\"theme\">\n      </dp-day-time-calendar>\n    </div>\n  </div>\n</div>\n",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [
                DatePickerService,
                DayTimeCalendarService,
                DayCalendarService,
                TimeSelectService,
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DatePickerComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return DatePickerComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-date-picker{display:inline-block}dp-date-picker.dp-material .dp-picker-input{box-sizing:border-box;height:30px;width:213px;font-size:13px;outline:0}dp-date-picker .dp-input-container{position:relative}dp-date-picker .dp-selected{background:#106cc8;color:#fff}.dp-popup{position:relative;background:#fff;box-shadow:1px 1px 5px 0 rgba(0,0,0,.1);border-left:1px solid rgba(0,0,0,.1);border-right:1px solid rgba(0,0,0,.1);border-bottom:1px solid rgba(0,0,0,.1);z-index:9999;white-space:nowrap}"]
        })
    ], DatePickerComponent);
    return DatePickerComponent;
}());
export { DatePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFDL0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBRXBFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVqRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFJbkUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFFeEUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFHdEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFHckUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDeEQsT0FBTyxFQUNMLGFBQWEsRUFDYix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBR2xCLE1BQU0sZ0JBQWdCLENBQUM7QUFNeEIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBMEJqRTtJQTJIRSw2QkFBNkIsZ0JBQW1DLEVBQ25DLFNBQW9CLEVBQ3BCLE9BQW1CLEVBQ25CLFFBQW1CLEVBQ25CLFlB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LENBQUMsY0FBTSxPQUFBLHFCQUFtQixFQUFuQixDQUFtQixDQUFDO29CQUNsRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsYUFBYTtvQkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEscUJBQW1CLEVBQW5CLENBQW1CLENBQUM7b0JBQ2xELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7O1NBQ0YsQ0FBQztPQUNXLG1CQUFtQixDQW9iL0I7SUFBRCwwQkFBQztDQUFBLEFBcGJELElBb2JDO1NBcGJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SURhdGV9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvZGF0ZS5tb2RlbCc7XG5pbXBvcnQge0RvbUhlbHBlcn0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL2RvbS1hcHBlbmRlci9kb20tYXBwZW5kZXIuc2VydmljZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtDYWxlbmRhck1vZGV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci1tb2RlJztcbmltcG9ydCB7RUNhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUtZW51bSc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge0VDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQge1NpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zaW5nbGUtY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtJRGF5Q2FsZW5kYXJDb25maWd9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7RGF5Q2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7RGF5Q2FsZW5kYXJTZXJ2aWNlfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF5VGltZUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuLi9kYXktdGltZS1jYWxlbmRhci9kYXktdGltZS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlfSBmcm9tICcuLi9kYXktdGltZS1jYWxlbmRhci9kYXktdGltZS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7SVRpbWVTZWxlY3RDb25maWd9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge1RpbWVTZWxlY3RDb21wb25lbnR9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQge1RpbWVTZWxlY3RTZXJ2aWNlfSBmcm9tICcuLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5zZXJ2aWNlJztcbmltcG9ydCB7SURhdGVQaWNrZXJDb25maWcsIElEYXRlUGlja2VyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vZGF0ZS1waWNrZXItY29uZmlnLm1vZGVsJztcbmltcG9ydCB7SURwRGF5UGlja2VyQXBpfSBmcm9tICcuL2RhdGUtcGlja2VyLmFwaSc7XG5pbXBvcnQge0RhdGVQaWNrZXJTZXJ2aWNlfSBmcm9tICcuL2RhdGUtcGlja2VyLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Db250cm9sLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgVmFsaWRhdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7TW9tZW50LCB1bml0T2ZUaW1lfSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtEYXRlVmFsaWRhdG9yfSBmcm9tICcuLi9jb21tb24vdHlwZXMvdmFsaWRhdG9yLnR5cGUnO1xuaW1wb3J0IHtNb250aENhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9tb250aC1jYWxlbmRhci9tb250aC1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcbmltcG9ydCB7U2VsZWN0RXZlbnR9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zZWxlY3Rpb24tZXZlbnQuZW51bSc7XG5pbXBvcnQge0lTZWxlY3Rpb25FdmVudH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NlbGVjdGlvbi1ldmVudC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRhdGUtcGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlLXBpY2tlci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAgRGF5VGltZUNhbGVuZGFyU2VydmljZSxcbiAgICBEYXlDYWxlbmRhclNlcnZpY2UsXG4gICAgVGltZVNlbGVjdFNlcnZpY2UsXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZVBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbkluaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyVmlld0luaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWYWxpZGF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uRGVzdHJveSB7XG5cbiAgZ2V0IG9wZW5PbkZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuT25Gb2N1cztcbiAgfVxuXG4gIGdldCBvcGVuT25DbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcub3Blbk9uQ2xpY2s7XG4gIH1cblxuICBnZXQgYXJlQ2FsZW5kYXJzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FyZUNhbGVuZGFyc1Nob3duO1xuICB9XG5cbiAgc2V0IGFyZUNhbGVuZGFyc1Nob3duKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnN0YXJ0R2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRvbUhlbHBlci5hcHBlbmRFbGVtZW50VG9Qb3NpdGlvbih7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy5hcHBlbmRUb0VsZW1lbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuY2FsZW5kYXJXcmFwcGVyLFxuICAgICAgICBhbmNob3I6IHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyLFxuICAgICAgICBkaW1FbGVtOiB0aGlzLnBvcHVwRWxlbSxcbiAgICAgICAgZHJvcHM6IHRoaXMuY29tcG9uZW50Q29uZmlnLmRyb3BzLFxuICAgICAgICBvcGVuczogdGhpcy5jb21wb25lbnRDb25maWcub3BlbnNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZGF5UGlja2VyU2VydmljZS5waWNrZXJDbG9zZWQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hcmVDYWxlbmRhcnNTaG93biA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkKCk6IE1vbWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudFtdKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLmlucHV0RWxlbWVudFZhbHVlID0gKDxzdHJpbmdbXT50aGlzLnV0aWxzU2VydmljZVxuICAgICAgLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkodGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LCBzZWxlY3RlZCwgRUNhbGVuZGFyVmFsdWUuU3RyaW5nQXJyKSlcbiAgICAgIC5qb2luKCcgfCAnKTtcbiAgICBjb25zdCB2YWwgPSB0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKTtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodmFsLCBmYWxzZSk7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KHZhbCk7XG4gIH1cblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoZGF0ZTogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gZGF0ZTtcblxuICAgIGlmICh0aGlzLmRheUNhbGVuZGFyUmVmKSB7XG4gICAgICB0aGlzLmRheUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vbnRoQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMubW9udGhDYWxlbmRhclJlZi5tb3ZlQ2FsZW5kYXJUbyhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXlUaW1lQ2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5VGltZUNhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgY29uZmlnOiBJRGF0ZVBpY2tlckNvbmZpZztcbiAgQElucHV0KCkgbW9kZTogQ2FsZW5kYXJNb2RlID0gJ2RheSc7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKSBtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBAT3V0cHV0KCkgb3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIGNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyVmFsdWU+KCk7XG4gIEBPdXRwdXQoKSBvbkdvVG9DdXJyZW50OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25SaWdodE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblNlbGVjdDogRXZlbnRFbWl0dGVyPElTZWxlY3Rpb25FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNhbGVuZGFyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdkYXlDYWxlbmRhcicpIGRheUNhbGVuZGFyUmVmOiBEYXlDYWxlbmRhckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnbW9udGhDYWxlbmRhcicpIG1vbnRoQ2FsZW5kYXJSZWY6IE1vbnRoQ2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2RheXRpbWVDYWxlbmRhcicpIGRheVRpbWVDYWxlbmRhclJlZjogRGF5VGltZUNhbGVuZGFyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCd0aW1lU2VsZWN0JykgdGltZVNlbGVjdFJlZjogVGltZVNlbGVjdENvbXBvbmVudDtcbiAgY29tcG9uZW50Q29uZmlnOiBJRGF0ZVBpY2tlckNvbmZpZ0ludGVybmFsO1xuICBkYXlDYWxlbmRhckNvbmZpZzogSURheUNhbGVuZGFyQ29uZmlnO1xuICBkYXlUaW1lQ2FsZW5kYXJDb25maWc6IElEYXlUaW1lQ2FsZW5kYXJDb25maWc7XG4gIHRpbWVTZWxlY3RDb25maWc6IElUaW1lU2VsZWN0Q29uZmlnO1xuICBoaWRlU3RhdGVIZWxwZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5wdXRWYWx1ZTogQ2FsZW5kYXJWYWx1ZTtcbiAgaXNGb2N1c2VkVHJpZ2dlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBpbnB1dEVsZW1lbnRWYWx1ZTogc3RyaW5nO1xuICBjYWxlbmRhcldyYXBwZXI6IEhUTUxFbGVtZW50O1xuICBhcHBlbmRUb0VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBpbnB1dEVsZW1lbnRDb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwb3B1cEVsZW06IEhUTUxFbGVtZW50O1xuICBoYW5kbGVJbm5lckVsZW1lbnRDbGlja1VubGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG4gIGdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG4gIHZhbGlkYXRlRm46IERhdGVWYWxpZGF0b3I7XG4gIGFwaTogSURwRGF5UGlja2VyQXBpID0ge1xuICAgIG9wZW46IHRoaXMuc2hvd0NhbGVuZGFycy5iaW5kKHRoaXMpLFxuICAgIGNsb3NlOiB0aGlzLmhpZGVDYWxlbmRhci5iaW5kKHRoaXMpLFxuICAgIG1vdmVDYWxlbmRhclRvOiB0aGlzLm1vdmVDYWxlbmRhclRvLmJpbmQodGhpcylcbiAgfTtcbiAgc2VsZWN0RXZlbnQgPSBTZWxlY3RFdmVudDtcblxuICBfYXJlQ2FsZW5kYXJzU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcbiAgX3NlbGVjdGVkOiBNb21lbnRbXSA9IFtdO1xuICBfY3VycmVudERhdGVWaWV3OiBNb21lbnQ7XG5cbiAgcHJpdmF0ZSBvbk9wZW5EZWxheVRpbWVvdXRIYW5kbGVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGF5UGlja2VyU2VydmljZTogRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZG9tSGVscGVyOiBEb21IZWxwZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZWxlbVJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uQ2xpY2soKSB7XG4gICAgaWYgKCF0aGlzLm9wZW5PbkNsaWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzRm9jdXNlZFRyaWdnZXIgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gdHJ1ZTtcbiAgICAgIGlmICghdGhpcy5hcmVDYWxlbmRhcnNTaG93bikge1xuICAgICAgICB0aGlzLnNob3dDYWxlbmRhcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkJvZHlDbGljaygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcuaGlkZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBpZiAoIXRoaXMuaGlkZVN0YXRlSGVscGVyICYmIHRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5oaWRlQ2FsZW5kYXIoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oaWRlU3RhdGVIZWxwZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgb25TY3JvbGwoKSB7XG4gICAgaWYgKHRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgIHRoaXMuZG9tSGVscGVyLnNldEVsZW1lbnRQb3NpdGlvbih7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy5hcHBlbmRUb0VsZW1lbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuY2FsZW5kYXJXcmFwcGVyLFxuICAgICAgICBhbmNob3I6IHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyLFxuICAgICAgICBkaW1FbGVtOiB0aGlzLnBvcHVwRWxlbSxcbiAgICAgICAgZHJvcHM6IHRoaXMuY29tcG9uZW50Q29uZmlnLmRyb3BzLFxuICAgICAgICBvcGVuczogdGhpcy5jb21wb25lbnRDb25maWcub3BlbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IENhbGVuZGFyVmFsdWUpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuY29udmVydFRvTW9tZW50QXJyYXkodmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25DaGFuZ2VDYWxsYmFjayhfOiBhbnksIGNoYW5nZWRCeUlucHV0OiBib29sZWFuKSB7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25Ub3VjaGVkQ2FsbGJhY2soKSB7XG4gIH1cblxuICB2YWxpZGF0ZShmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZuKGZvcm1Db250cm9sLnZhbHVlKTtcbiAgfVxuXG4gIHByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkOiBNb21lbnRbXSB8IHN0cmluZyk6IENhbGVuZGFyVmFsdWUge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gc2VsZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICAgIHNlbGVjdGVkLFxuICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5yZXR1cm5lZFZhbHVlVHlwZSB8fCB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpbml0VmFsaWRhdG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLnZhbGlkYXRlRm4gPSB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVWYWxpZGF0b3IoXG4gICAgICB7XG4gICAgICAgIG1pbkRhdGU6IHRoaXMubWluRGF0ZSxcbiAgICAgICAgbWF4RGF0ZTogdGhpcy5tYXhEYXRlLFxuICAgICAgICBtaW5UaW1lOiB0aGlzLm1pblRpbWUsXG4gICAgICAgIG1heFRpbWU6IHRoaXMubWF4VGltZVxuICAgICAgfSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LCB0aGlzLm1vZGUpO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCksIGZhbHNlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5Eb20oKTtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBzZXRFbGVtZW50UG9zaXRpb25JbkRvbSgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyV3JhcHBlciA9IDxIVE1MRWxlbWVudD50aGlzLmNhbGVuZGFyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5zZXRJbnB1dEVsZW1lbnRDb250YWluZXIoKTtcbiAgICB0aGlzLnBvcHVwRWxlbSA9IHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcC1wb3B1cCcpO1xuICAgIHRoaXMuaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2sodGhpcy5wb3B1cEVsZW0pO1xuXG4gICAgY29uc3Qge2FwcGVuZFRvfSA9IHRoaXMuY29tcG9uZW50Q29uZmlnO1xuICAgIGlmIChhcHBlbmRUbykge1xuICAgICAgaWYgKHR5cGVvZiBhcHBlbmRUbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcig8c3RyaW5nPmFwcGVuZFRvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50ID0gPEhUTUxFbGVtZW50PmFwcGVuZFRvO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudCA9IHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2FsZW5kYXJXcmFwcGVyKTtcbiAgfVxuXG4gIHNldElucHV0RWxlbWVudENvbnRhaW5lcigpIHtcbiAgICB0aGlzLmlucHV0RWxlbWVudENvbnRhaW5lciA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldE5hdGl2ZUVsZW1lbnQodGhpcy5jb21wb25lbnRDb25maWcuaW5wdXRFbGVtZW50Q29udGFpbmVyKVxuICAgICAgfHwgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRwLWlucHV0LWNvbnRhaW5lcicpXG4gICAgICB8fCBkb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2soZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrVW5saXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQsICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5oaWRlU3RhdGVIZWxwZXIgPSB0cnVlO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNvbXBvbmVudENvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcsIHRoaXMubW9kZSk7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLmRpc3BsYXlEYXRlXG4gICAgICA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudCh0aGlzLmRpc3BsYXlEYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpLmNsb25lKClcbiAgICAgIDogdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldERlZmF1bHREaXNwbGF5RGF0ZShcbiAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlVmlldyxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgICk7XG4gICAgdGhpcy5kYXlDYWxlbmRhckNvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXREYXlDb25maWdTZXJ2aWNlKHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICB0aGlzLmRheVRpbWVDYWxlbmRhckNvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXREYXlUaW1lQ29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy50aW1lU2VsZWN0Q29uZmlnID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmdldFRpbWVDb25maWdTZXJ2aWNlKHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbnB1dEZvY3VzZWQoKSB7XG4gICAgaWYgKCF0aGlzLm9wZW5PbkZvY3VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMub25PcGVuRGVsYXlUaW1lb3V0SGFuZGxlcik7XG4gICAgdGhpcy5pc0ZvY3VzZWRUcmlnZ2VyID0gdHJ1ZTtcbiAgICB0aGlzLm9uT3BlbkRlbGF5VGltZW91dEhhbmRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5hcmVDYWxlbmRhcnNTaG93bikge1xuICAgICAgICB0aGlzLnNob3dDYWxlbmRhcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5oaWRlU3RhdGVIZWxwZXIgPSBmYWxzZTtcblxuICAgICAgdGhpcy5pc0ZvY3VzZWRUcmlnZ2VyID0gZmFsc2U7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH0sIHRoaXMuY29tcG9uZW50Q29uZmlnLm9uT3BlbkRlbGF5KTtcbiAgfVxuXG4gIGlucHV0Qmx1cnJlZCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5vbk9wZW5EZWxheVRpbWVvdXRIYW5kbGVyKTtcbiAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKCk7XG4gIH1cblxuICBzaG93Q2FsZW5kYXJzKCkge1xuICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gdHJ1ZTtcbiAgICB0aGlzLmFyZUNhbGVuZGFyc1Nob3duID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnRpbWVTZWxlY3RSZWYpIHtcbiAgICAgIHRoaXMudGltZVNlbGVjdFJlZi5hcGkudHJpZ2dlckNoYW5nZSgpO1xuICAgIH1cblxuICAgIHRoaXMub3Blbi5lbWl0KCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGhpZGVDYWxlbmRhcigpIHtcbiAgICB0aGlzLmFyZUNhbGVuZGFyc1Nob3duID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5kYXlDYWxlbmRhclJlZikge1xuICAgICAgdGhpcy5kYXlDYWxlbmRhclJlZi5hcGkudG9nZ2xlQ2FsZW5kYXJNb2RlKEVDYWxlbmRhck1vZGUuRGF5KTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlLmVtaXQoKTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgb25WaWV3RGF0ZUNoYW5nZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGNvbnN0IHN0clZhbCA9IHZhbHVlID8gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvU3RyaW5nKHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpIDogJyc7XG4gICAgaWYgKHRoaXMuZGF5UGlja2VyU2VydmljZS5pc1ZhbGlkSW5wdXREYXRlVmFsdWUoc3RyVmFsLCB0aGlzLmNvbXBvbmVudENvbmZpZykpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuY29udmVydElucHV0VmFsdWVUb01vbWVudEFycmF5KHN0clZhbCwgdGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aFxuICAgICAgICA/IHRoaXMudXRpbHNTZXJ2aWNlLmdldERlZmF1bHREaXNwbGF5RGF0ZShcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW5cbiAgICAgICAgKVxuICAgICAgICA6IHRoaXMuY3VycmVudERhdGVWaWV3O1xuXG4gICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoe1xuICAgICAgICBkYXRlOiBzdHJWYWwsXG4gICAgICAgIHR5cGU6IFNlbGVjdEV2ZW50LklOUFVULFxuICAgICAgICBncmFudWxhcml0eTogbnVsbFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0VmFsaWRNb21lbnRBcnJheShzdHJWYWwsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzdHJWYWwpLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBkYXRlU2VsZWN0ZWQoZGF0ZTogSURhdGUsIGdyYW51bGFyaXR5OiB1bml0T2ZUaW1lLkJhc2UsIHR5cGU6IFNlbGVjdEV2ZW50LCBpZ25vcmVDbG9zZT86IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgIC51cGRhdGVTZWxlY3RlZCh0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LCB0aGlzLnNlbGVjdGVkLCBkYXRlLCBncmFudWxhcml0eSk7XG4gICAgaWYgKCFpZ25vcmVDbG9zZSkge1xuICAgICAgdGhpcy5vbkRhdGVDbGljaygpO1xuICAgIH1cblxuICAgIHRoaXMub25TZWxlY3QuZW1pdCh7XG4gICAgICBkYXRlOiBkYXRlLmRhdGUsXG4gICAgICBncmFudWxhcml0eSxcbiAgICAgIHR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIG9uRGF0ZUNsaWNrKCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudENvbmZpZy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMuaGlkZUNhbGVuZGFyLmJpbmQodGhpcyksIHRoaXMuY29tcG9uZW50Q29uZmlnLmNsb3NlT25TZWxlY3REZWxheSk7XG4gICAgfVxuICB9XG5cbiAgb25LZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSAoOSk6XG4gICAgICBjYXNlICgyNyk6XG4gICAgICAgIHRoaXMuaGlkZUNhbGVuZGFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVDYWxlbmRhclRvKGRhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWUpIHtcbiAgICBjb25zdCBtb21lbnREYXRlID0gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KGRhdGUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb21lbnREYXRlO1xuICB9XG5cbiAgb25MZWZ0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgc3RhcnRHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5nbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVycy5wdXNoKFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdrZXlkb3duJywgKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5vbktleVByZXNzKGUpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudCwgJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5vblNjcm9sbCgpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudCwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLm9uQm9keUNsaWNrKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzdG9wR2xvYmFsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnMuZm9yRWFjaCgodWwpID0+IHVsKCkpO1xuICAgIHRoaXMuZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2tVbmxpc3RlbmVycy5mb3JFYWNoKHVsID0+IHVsKCkpO1xuXG4gICAgaWYgKHRoaXMuYXBwZW5kVG9FbGVtZW50KSB7XG4gICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNhbGVuZGFyV3JhcHBlcik7XG4gICAgfVxuICB9XG59XG4iXX0=