import { __decorate } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TimeSelectService, TimeUnit } from './time-select.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
var moment = momentNs;
var TimeSelectComponent = /** @class */ (function () {
    function TimeSelectComponent(timeSelectService, utilsService, cd) {
        this.timeSelectService = timeSelectService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.isInited = false;
        this.api = {
            triggerChange: this.emitChange.bind(this)
        };
    }
    TimeSelectComponent_1 = TimeSelectComponent;
    Object.defineProperty(TimeSelectComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.calculateTimeParts(this.selected);
            this.showDecHour = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'hour');
            this.showDecMinute = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'minute');
            this.showDecSecond = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'second');
            this.showIncHour = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'hour');
            this.showIncMinute = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'minute');
            this.showIncSecond = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'second');
            this.showToggleMeridiem = this.timeSelectService.shouldShowToggleMeridiem(this.componentConfig, this._selected);
            this.onChangeCallback(this.processOnChangeCallback(selected));
        },
        enumerable: true,
        configurable: true
    });
    TimeSelectComponent.prototype.ngOnInit = function () {
        this.isInited = true;
        this.init();
        this.initValidators();
    };
    TimeSelectComponent.prototype.init = function () {
        this.componentConfig = this.timeSelectService.getConfig(this.config);
        this.selected = this.selected || moment();
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    };
    TimeSelectComponent.prototype.ngOnChanges = function (changes) {
        if (this.isInited) {
            var minDate = changes.minDate, maxDate = changes.maxDate, minTime = changes.minTime, maxTime = changes.maxTime;
            this.init();
            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
            this.handleConfigChange(changes.config);
        }
    };
    TimeSelectComponent.prototype.writeValue = function (value) {
        this.inputValue = value;
        if (value) {
            var momentValue = this.utilsService
                .convertToMomentArray(value, {
                allowMultiSelect: false,
                format: this.timeSelectService.getTimeFormat(this.componentConfig)
            })[0];
            if (momentValue.isValid()) {
                this.selected = momentValue;
                this.inputValueType = this.utilsService
                    .getInputType(this.inputValue, false);
            }
        }
        this.cd.markForCheck();
    };
    TimeSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    TimeSelectComponent.prototype.onChangeCallback = function (_) {
    };
    TimeSelectComponent.prototype.registerOnTouched = function (fn) {
    };
    TimeSelectComponent.prototype.validate = function (formControl) {
        if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
            return this.validateFn(formControl.value);
        }
        else {
            return function () { return null; };
        }
    };
    TimeSelectComponent.prototype.processOnChangeCallback = function (value) {
        return this.utilsService.convertFromMomentArray(this.timeSelectService.getTimeFormat(this.componentConfig), [value], this.componentConfig.returnedValueType || this.inputValueType);
    };
    TimeSelectComponent.prototype.initValidators = function () {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, undefined, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    };
    TimeSelectComponent.prototype.decrease = function (unit) {
        this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected, unit);
        this.emitChange();
    };
    TimeSelectComponent.prototype.increase = function (unit) {
        this.selected = this.timeSelectService.increase(this.componentConfig, this.selected, unit);
        this.emitChange();
    };
    TimeSelectComponent.prototype.toggleMeridiem = function () {
        this.selected = this.timeSelectService.toggleMeridiem(this.selected);
        this.emitChange();
    };
    TimeSelectComponent.prototype.emitChange = function () {
        this.onChange.emit({ date: this.selected, selected: false });
        this.cd.markForCheck();
    };
    TimeSelectComponent.prototype.calculateTimeParts = function (time) {
        this.hours = this.timeSelectService.getHours(this.componentConfig, time);
        this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
        this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
        this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
    };
    TimeSelectComponent.prototype.handleConfigChange = function (config) {
        if (config) {
            var prevConf = this.timeSelectService.getConfig(config.previousValue);
            var currentConf = this.timeSelectService.getConfig(config.currentValue);
            if (prevConf.locale !== currentConf.locale) {
                this.selected = this.selected.clone().locale(currentConf.locale);
            }
        }
    };
    var TimeSelectComponent_1;
    TimeSelectComponent.ctorParameters = function () { return [
        { type: TimeSelectService },
        { type: UtilsService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "config", void 0);
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "displayDate", void 0);
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "minDate", void 0);
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "maxDate", void 0);
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "minTime", void 0);
    __decorate([
        Input()
    ], TimeSelectComponent.prototype, "maxTime", void 0);
    __decorate([
        HostBinding('class'), Input()
    ], TimeSelectComponent.prototype, "theme", void 0);
    __decorate([
        Output()
    ], TimeSelectComponent.prototype, "onChange", void 0);
    TimeSelectComponent = TimeSelectComponent_1 = __decorate([
        Component({
            selector: 'dp-time-select',
            template: "<ul class=\"dp-time-select-controls\">\n  <li class=\"dp-time-select-control dp-time-select-control-hours\">\n    <button (click)=\"increase('hour')\"\n            [disabled]=\"!showIncHour\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"hours\"\n          class=\"dp-time-select-display-hours\">\n    </span>\n    <button (click)=\"decrease('hour')\"\n            [disabled]=\"!showDecHour\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <li [innerText]=\"componentConfig.timeSeparator\"\n      class=\"dp-time-select-control dp-time-select-separator\">\n  </li>\n  <li class=\"dp-time-select-control dp-time-select-control-minutes\">\n    <button (click)=\"increase('minute')\"\n            [disabled]=\"!showIncMinute\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\"></button>\n    <span [innerText]=\"minutes\"\n          class=\"dp-time-select-display-minutes\">\n    </span>\n    <button (click)=\"decrease('minute')\"\n            [disabled]=\"!showDecMinute\" class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <ng-container *ngIf=\"componentConfig.showSeconds\">\n    <li [innerText]=\"componentConfig.timeSeparator\"\n        class=\"dp-time-select-control dp-time-select-separator\">\n    </li>\n    <li class=\"dp-time-select-control dp-time-select-control-seconds\">\n      <button (click)=\"increase('second')\"\n              [disabled]=\"!showIncSecond\"\n              class=\"dp-time-select-control-up\"\n              type=\"button\"></button>\n      <span [innerText]=\"seconds\"\n            class=\"dp-time-select-display-seconds\">\n      </span>\n      <button (click)=\"decrease('second')\"\n              [disabled]=\"!showDecSecond\"\n              class=\"dp-time-select-control-down\"\n              type=\"button\">\n      </button>\n    </li>\n  </ng-container>\n  <li *ngIf=\"!componentConfig.showTwentyFourHours\" class=\"dp-time-select-control dp-time-select-control-meridiem\">\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"meridiem\"\n          class=\"dp-time-select-display-meridiem\">\n    </span>\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n</ul>\n",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [
                TimeSelectService,
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return TimeSelectComponent_1; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return TimeSelectComponent_1; }),
                    multi: true
                }
            ],
            styles: ["dp-time-select{display:inline-block}dp-time-select .dp-time-select-controls{margin:0;padding:0;text-align:center;line-height:normal;background:#fff}dp-time-select .dp-time-select-control{display:inline-block;width:35px;margin:0 auto;vertical-align:middle;font-size:inherit;letter-spacing:1px}dp-time-select .dp-time-select-control-down,dp-time-select .dp-time-select-control-up{position:relative;display:block;width:24px;height:24px;margin:3px auto;cursor:pointer}dp-time-select .dp-time-select-control-down::before,dp-time-select .dp-time-select-control-up::before{position:relative;content:'';display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0}dp-time-select .dp-time-select-control-up::before{transform:rotate(-45deg);top:4px}dp-time-select .dp-time-select-control-down::before{transform:rotate(135deg)}dp-time-select .dp-time-select-separator{width:5px}dp-time-select.dp-material .dp-time-select-control-down,dp-time-select.dp-material .dp-time-select-control-up{box-sizing:border-box;background:0 0;border:none;outline:0;border-radius:50%}dp-time-select.dp-material .dp-time-select-control-down::before,dp-time-select.dp-material .dp-time-select-control-up::before{left:0}dp-time-select.dp-material .dp-time-select-control-down:hover,dp-time-select.dp-material .dp-time-select-control-up:hover{background:#e0e0e0}"]
        })
    ], TimeSelectComponent);
    return TimeSelectComponent;
}());
export { TimeSelectComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsidGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksRUFDWixhQUFhLEVBQ2IsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRSxPQUFPLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUduQyxPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUtwRSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFzQnhCO0lBcURFLDZCQUFtQixpQkFBb0MsRUFDcEMsWUFBMEIsRUFDMUIsRUFBcUI7UUFGckIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXpCOUIsYUFBUSxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdELGFBQVEsR0FBWSxLQUFLLENBQUM7UUFnQjFCLFFBQUcsR0FBRztZQUNKLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDMUMsQ0FBQztJQU9GLENBQUM7NEJBeERVLG1CQUFtQjtJQUU5QixzQkFBSSx5Q0FBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMs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bHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQge1NpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zaW5nbGUtY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUaW1lU2VsZWN0U2VydmljZSwgVGltZVVuaXR9IGZyb20gJy4vdGltZS1zZWxlY3Quc2VydmljZSc7XG5pbXBvcnQgKiBhcyBtb21lbnROcyBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtNb21lbnR9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0lUaW1lU2VsZWN0Q29uZmlnLCBJVGltZVNlbGVjdENvbmZpZ0ludGVybmFsfSBmcm9tICcuL3RpbWUtc2VsZWN0LWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SURhdGV9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvZGF0ZS5tb2RlbCc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZ0ludGVybmFsfSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudE5zO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC10aW1lLXNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAndGltZS1zZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGltZS1zZWxlY3QuY29tcG9uZW50Lmxlc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIFRpbWVTZWxlY3RTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVGltZVNlbGVjdENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRpbWVTZWxlY3RDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgVGltZVNlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBnZXQgc2VsZWN0ZWQoKTogTW9tZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IE1vbWVudCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgdGhpcy5jYWxjdWxhdGVUaW1lUGFydHModGhpcy5zZWxlY3RlZCk7XG5cbiAgICB0aGlzLnNob3dEZWNIb3VyID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5zaG91bGRTaG93RGVjcmVhc2UodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX3NlbGVjdGVkLCAnaG91cicpO1xuICAgIHRoaXMuc2hvd0RlY01pbnV0ZSA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2Uuc2hvdWxkU2hvd0RlY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9zZWxlY3RlZCwgJ21pbnV0ZScpO1xuICAgIHRoaXMuc2hvd0RlY1NlY29uZCA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2Uuc2hvdWxkU2hvd0RlY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9zZWxlY3RlZCwgJ3NlY29uZCcpO1xuXG4gICAgdGhpcy5zaG93SW5jSG91ciA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2Uuc2hvdWxkU2hvd0luY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9zZWxlY3RlZCwgJ2hvdXInKTtcbiAgICB0aGlzLnNob3dJbmNNaW51dGUgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLnNob3VsZFNob3dJbmNyZWFzZSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fc2VsZWN0ZWQsICdtaW51dGUnKTtcbiAgICB0aGlzLnNob3dJbmNTZWNvbmQgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLnNob3VsZFNob3dJbmNyZWFzZSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fc2VsZWN0ZWQsICdzZWNvbmQnKTtcblxuICAgIHRoaXMuc2hvd1RvZ2dsZU1lcmlkaWVtID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5zaG91bGRTaG93VG9nZ2xlTWVyaWRpZW0odGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX3NlbGVjdGVkKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHNlbGVjdGVkKSk7XG4gIH1cblxuICBASW5wdXQoKSBjb25maWc6IElUaW1lU2VsZWN0Q29uZmlnO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluVGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4VGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPElEYXRlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgaXNJbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29tcG9uZW50Q29uZmlnOiBJVGltZVNlbGVjdENvbmZpZ0ludGVybmFsO1xuICBpbnB1dFZhbHVlOiBDYWxlbmRhclZhbHVlO1xuICBpbnB1dFZhbHVlVHlwZTogRUNhbGVuZGFyVmFsdWU7XG4gIHZhbGlkYXRlRm46IERhdGVWYWxpZGF0b3I7XG4gIGhvdXJzOiBzdHJpbmc7XG4gIG1pbnV0ZXM6IHN0cmluZztcbiAgc2Vjb25kczogc3RyaW5nO1xuICBtZXJpZGllbTogc3RyaW5nO1xuICBzaG93RGVjSG91cjogYm9vbGVhbjtcbiAgc2hvd0RlY01pbnV0ZTogYm9vbGVhbjtcbiAgc2hvd0RlY1NlY29uZDogYm9vbGVhbjtcbiAgc2hvd0luY0hvdXI6IGJvb2xlYW47XG4gIHNob3dJbmNNaW51dGU6IGJvb2xlYW47XG4gIHNob3dJbmNTZWNvbmQ6IGJvb2xlYW47XG4gIHNob3dUb2dnbGVNZXJpZGllbTogYm9vbGVhbjtcbiAgYXBpID0ge1xuICAgIHRyaWdnZXJDaGFuZ2U6IHRoaXMuZW1pdENoYW5nZS5iaW5kKHRoaXMpXG4gIH07XG5cbiAgX3NlbGVjdGVkOiBNb21lbnQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRpbWVTZWxlY3RTZXJ2aWNlOiBUaW1lU2VsZWN0U2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRDb25maWcodGhpcy5jb25maWcpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkIHx8IG1vbWVudCgpO1xuICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZS5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0ZWQpIHtcbiAgICAgIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlLCBtaW5UaW1lLCBtYXhUaW1lfSA9IGNoYW5nZXM7XG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgaWYgKG1pbkRhdGUgfHwgbWF4RGF0ZSB8fCBtaW5UaW1lIHx8IG1heFRpbWUpIHtcbiAgICAgICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZUNvbmZpZ0NoYW5nZShjaGFuZ2VzLmNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogQ2FsZW5kYXJWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBtb21lbnRWYWx1ZSA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5jb252ZXJ0VG9Nb21lbnRBcnJheSh2YWx1ZSwge1xuICAgICAgICAgIGFsbG93TXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgICAgICAgIGZvcm1hdDogdGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRUaW1lRm9ybWF0KHRoaXMuY29tcG9uZW50Q29uZmlnKVxuICAgICAgICB9KVswXTtcbiAgICAgIGlmIChtb21lbnRWYWx1ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IG1vbWVudFZhbHVlO1xuICAgICAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgICAuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55KSB7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gIH1cblxuICB2YWxpZGF0ZShmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgYW55IHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSB8fCB0aGlzLm1pblRpbWUgfHwgdGhpcy5tYXhUaW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZuKGZvcm1Db250cm9sLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICgpID0+IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodmFsdWU6IE1vbWVudCk6IENhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgdGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRUaW1lRm9ybWF0KHRoaXMuY29tcG9uZW50Q29uZmlnKSxcbiAgICAgIFt2YWx1ZV0sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5yZXR1cm5lZFZhbHVlVHlwZSB8fCB0aGlzLmlucHV0VmFsdWVUeXBlXG4gICAgKTtcbiAgfVxuXG4gIGluaXRWYWxpZGF0b3JzKCkge1xuICAgIHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZVZhbGlkYXRvcihcbiAgICAgIHtcbiAgICAgICAgbWluRGF0ZTogdGhpcy5taW5EYXRlLFxuICAgICAgICBtYXhEYXRlOiB0aGlzLm1heERhdGUsXG4gICAgICAgIG1pblRpbWU6IHRoaXMubWluVGltZSxcbiAgICAgICAgbWF4VGltZTogdGhpcy5tYXhUaW1lXG4gICAgICB9LCB1bmRlZmluZWQsICdkYXknKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIGRlY3JlYXNlKHVuaXQ6IFRpbWVVbml0KSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZGVjcmVhc2UodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuc2VsZWN0ZWQsIHVuaXQpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgaW5jcmVhc2UodW5pdDogVGltZVVuaXQpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5pbmNyZWFzZSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5zZWxlY3RlZCwgdW5pdCk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB0b2dnbGVNZXJpZGllbSgpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS50b2dnbGVNZXJpZGllbSh0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtkYXRlOiB0aGlzLnNlbGVjdGVkLCBzZWxlY3RlZDogZmFsc2V9KTtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgY2FsY3VsYXRlVGltZVBhcnRzKHRpbWU6IE1vbWVudCkge1xuICAgIHRoaXMuaG91cnMgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldEhvdXJzKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aW1lKTtcbiAgICB0aGlzLm1pbnV0ZXMgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldE1pbnV0ZXModGhpcy5jb21wb25lbnRDb25maWcsIHRpbWUpO1xuICAgIHRoaXMuc2Vjb25kcyA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0U2Vjb25kcyh0aGlzLmNvbXBvbmVudENvbmZpZywgdGltZSk7XG4gICAgdGhpcy5tZXJpZGllbSA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0TWVyaWRpZW0odGhpcy5jb21wb25lbnRDb25maWcsIHRpbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnOiBTaW1wbGVDaGFuZ2UpIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBjb25zdCBwcmV2Q29uZjogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldENvbmZpZyhjb25maWcucHJldmlvdXNWYWx1ZSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29uZjogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldENvbmZpZyhjb25maWcuY3VycmVudFZhbHVlKTtcblxuICAgICAgaWYgKHByZXZDb25mLmxvY2FsZSAhPT0gY3VycmVudENvbmYubG9jYWxlKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkLmNsb25lKCkubG9jYWxlKGN1cnJlbnRDb25mLmxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=