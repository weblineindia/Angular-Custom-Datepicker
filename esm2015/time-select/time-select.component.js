var TimeSelectComponent_1;
import { __decorate } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TimeSelectService, TimeUnit } from './time-select.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
let TimeSelectComponent = TimeSelectComponent_1 = class TimeSelectComponent {
    constructor(timeSelectService, utilsService, cd) {
        this.timeSelectService = timeSelectService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.isInited = false;
        this.api = {
            triggerChange: this.emitChange.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
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
    }
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.timeSelectService.getConfig(this.config);
        this.selected = this.selected || moment();
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, minTime, maxTime } = changes;
            this.init();
            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
            this.handleConfigChange(changes.config);
        }
    }
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            const momentValue = this.utilsService
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
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.timeSelectService.getTimeFormat(this.componentConfig), [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, undefined, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    decrease(unit) {
        this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    increase(unit) {
        this.selected = this.timeSelectService.increase(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    toggleMeridiem() {
        this.selected = this.timeSelectService.toggleMeridiem(this.selected);
        this.emitChange();
    }
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
        this.cd.markForCheck();
    }
    calculateTimeParts(time) {
        this.hours = this.timeSelectService.getHours(this.componentConfig, time);
        this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
        this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
        this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.timeSelectService.getConfig(config.previousValue);
            const currentConf = this.timeSelectService.getConfig(config.currentValue);
            if (prevConf.locale !== currentConf.locale) {
                this.selected = this.selected.clone().locale(currentConf.locale);
            }
        }
    }
};
TimeSelectComponent.ctorParameters = () => [
    { type: TimeSelectService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
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
                useExisting: forwardRef(() => TimeSelectComponent_1),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => TimeSelectComponent_1),
                multi: true
            }
        ],
        styles: ["dp-time-select{display:inline-block}dp-time-select .dp-time-select-controls{margin:0;padding:0;text-align:center;line-height:normal;background:#fff}dp-time-select .dp-time-select-control{display:inline-block;width:35px;margin:0 auto;vertical-align:middle;font-size:inherit;letter-spacing:1px}dp-time-select .dp-time-select-control-down,dp-time-select .dp-time-select-control-up{position:relative;display:block;width:24px;height:24px;margin:3px auto;cursor:pointer}dp-time-select .dp-time-select-control-down::before,dp-time-select .dp-time-select-control-up::before{position:relative;content:'';display:inline-block;height:8px;width:8px;vertical-align:baseline;border-style:solid;border-width:2px 2px 0 0}dp-time-select .dp-time-select-control-up::before{transform:rotate(-45deg);top:4px}dp-time-select .dp-time-select-control-down::before{transform:rotate(135deg)}dp-time-select .dp-time-select-separator{width:5px}dp-time-select.dp-material .dp-time-select-control-down,dp-time-select.dp-material .dp-time-select-control-up{box-sizing:border-box;background:0 0;border:none;outline:0;border-radius:50%}dp-time-select.dp-material .dp-time-select-control-down::before,dp-time-select.dp-material .dp-time-select-control-up::before{left:0}dp-time-select.dp-material .dp-time-select-control-down:hover,dp-time-select.dp-material .dp-time-select-control-up:hover{background:#e0e0e0}"]
    })
], TimeSelectComponent);
export { TimeSelectComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsidGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBQ1osYUFBYSxFQUNiLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEUsT0FBTyxLQUFLLFFBQVEsTUFBTSxRQUFRLENBQUM7QUFHbkMsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFHbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFLcEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBc0J4QixJQUFhLG1CQUFtQiwyQkFBaEMsTUFBYSxtQkFBbUI7SUFxRDlCLFlBQW1CLGlCQUFvQyxFQUNwQyxZQUEwQixFQUMxQixFQUFxQjtRQUZyQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBekI5QixhQUFRLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0QsYUFBUSxHQUFZLEtBQUssQ0FBQztRQWdCMUIsUUFBRyxHQUFHO1lBQ0osYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUMxQyxDQUFDO0lBT0YsQ0FBQztJQXRERCxJQUFJLFFBQVE7UUFDVixPQUFP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bEU7U0FDRjtJQUNILENBQUM7Q0FDRixDQUFBOztZQTVIdUMsaUJBQWlCO1lBQ3RCLFlBQVk7WUFDdEIsaUJBQWlCOztBQWhDL0I7SUFBUixLQUFLLEVBQUU7bURBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFO3dEQUFrQztBQUNqQztJQUFSLEtBQUssRUFBRTtvREFBOEI7QUFDN0I7SUFBUixLQUFLLEVBQUU7b0RBQThCO0FBQzdCO0lBQVIsS0FBSyxFQUFFO29EQUE4QjtBQUM3QjtJQUFSLEtBQUssRUFBRTtvREFBOEI7QUFDUDtJQUE5QixXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFO2tEQUFlO0FBQ25DO0lBQVQsTUFBTSxFQUFFO3FEQUFvRDtBQTlCbEQsbUJBQW1CO0lBcEIvQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLGlrRkFBeUM7UUFFekMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7UUFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07UUFDL0MsU0FBUyxFQUFFO1lBQ1QsaUJBQWlCO1lBQ2pCO2dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQW1CLENBQUM7Z0JBQ2xELEtBQUssRUFBRSxJQUFJO2FBQ1o7WUFDRDtnQkFDRSxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBbUIsQ0FBQztnQkFDbEQsS0FBSyxFQUFFLElBQUk7YUFDWjtTQUNGOztLQUNGLENBQUM7R0FDVyxtQkFBbUIsQ0FpTC9CO1NBakxZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RpbWVTZWxlY3RTZXJ2aWNlLCBUaW1lVW5pdH0gZnJvbSAnLi90aW1lLXNlbGVjdC5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIG1vbWVudE5zIGZyb20gJ21vbWVudCc7XG5pbXBvcnQge01vbWVudH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7SVRpbWVTZWxlY3RDb25maWcsIElUaW1lU2VsZWN0Q29uZmlnSW50ZXJuYWx9IGZyb20gJy4vdGltZS1zZWxlY3QtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF0ZX0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9kYXRlLm1vZGVsJztcbmltcG9ydCB7RGF0ZVZhbGlkYXRvcn0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3ZhbGlkYXRvci50eXBlJztcbmltcG9ydCB7SURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXItY29uZmlnLm1vZGVsJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLXRpbWUtc2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICd0aW1lLXNlbGVjdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0aW1lLXNlbGVjdC5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgVGltZVNlbGVjdFNlcnZpY2UsXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBUaW1lU2VsZWN0Q29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVGltZVNlbGVjdENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBUaW1lU2VsZWN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBWYWxpZGF0b3Ige1xuXG4gIGdldCBzZWxlY3RlZCgpOiBNb21lbnQge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogTW9tZW50KSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLmNhbGN1bGF0ZVRpbWVQYXJ0cyh0aGlzLnNlbGVjdGVkKTtcblxuICAgIHRoaXMuc2hvd0RlY0hvdXIgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLnNob3VsZFNob3dEZWNyZWFzZSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fc2VsZWN0ZWQsICdob3VyJyk7XG4gICAgdGhpcy5zaG93RGVjTWludXRlID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5zaG91bGRTaG93RGVjcmVhc2UodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX3NlbGVjdGVkLCAnbWludXRlJyk7XG4gICAgdGhpcy5zaG93RGVjU2Vjb25kID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5zaG91bGRTaG93RGVjcmVhc2UodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX3NlbGVjdGVkLCAnc2Vjb25kJyk7XG5cbiAgICB0aGlzLnNob3dJbmNIb3VyID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5zaG91bGRTaG93SW5jcmVhc2UodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX3NlbGVjdGVkLCAnaG91cicpO1xuICAgIHRoaXMuc2hvd0luY01pbnV0ZSA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2Uuc2hvdWxkU2hvd0luY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9zZWxlY3RlZCwgJ21pbnV0ZScpO1xuICAgIHRoaXMuc2hvd0luY1NlY29uZCA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2Uuc2hvdWxkU2hvd0luY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLl9zZWxlY3RlZCwgJ3NlY29uZCcpO1xuXG4gICAgdGhpcy5zaG93VG9nZ2xlTWVyaWRpZW0gPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLnNob3VsZFNob3dUb2dnbGVNZXJpZGllbSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fc2VsZWN0ZWQpO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIEBJbnB1dCgpIGNvbmZpZzogSVRpbWVTZWxlY3RDb25maWc7XG4gIEBJbnB1dCgpIGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5EYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtaW5UaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASW5wdXQoKSBtYXhUaW1lOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8SURhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBpc0luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBjb21wb25lbnRDb25maWc6IElUaW1lU2VsZWN0Q29uZmlnSW50ZXJuYWw7XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlucHV0VmFsdWVUeXBlOiBFQ2FsZW5kYXJWYWx1ZTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgaG91cnM6IHN0cmluZztcbiAgbWludXRlczogc3RyaW5nO1xuICBzZWNvbmRzOiBzdHJpbmc7XG4gIG1lcmlkaWVtOiBzdHJpbmc7XG4gIHNob3dEZWNIb3VyOiBib29sZWFuO1xuICBzaG93RGVjTWludXRlOiBib29sZWFuO1xuICBzaG93RGVjU2Vjb25kOiBib29sZWFuO1xuICBzaG93SW5jSG91cjogYm9vbGVhbjtcbiAgc2hvd0luY01pbnV0ZTogYm9vbGVhbjtcbiAgc2hvd0luY1NlY29uZDogYm9vbGVhbjtcbiAgc2hvd1RvZ2dsZU1lcmlkaWVtOiBib29sZWFuO1xuICBhcGkgPSB7XG4gICAgdHJpZ2dlckNoYW5nZTogdGhpcy5lbWl0Q2hhbmdlLmJpbmQodGhpcylcbiAgfTtcblxuICBfc2VsZWN0ZWQ6IE1vbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZVNlbGVjdFNlcnZpY2U6IFRpbWVTZWxlY3RTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaXNJbml0ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQgfHwgbW9tZW50KCk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIGZhbHNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5pc0luaXRlZCkge1xuICAgICAgY29uc3Qge21pbkRhdGUsIG1heERhdGUsIG1pblRpbWUsIG1heFRpbWV9ID0gY2hhbmdlcztcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlIHx8IG1pblRpbWUgfHwgbWF4VGltZSkge1xuICAgICAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlQ29uZmlnQ2hhbmdlKGNoYW5nZXMuY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IG1vbWVudFZhbHVlID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB7XG4gICAgICAgICAgYWxsb3dNdWx0aVNlbGVjdDogZmFsc2UsXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldFRpbWVGb3JtYXQodGhpcy5jb21wb25lbnRDb25maWcpXG4gICAgICAgIH0pWzBdO1xuICAgICAgaWYgKG1vbWVudFZhbHVlLmlzVmFsaWQoKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbW9tZW50VmFsdWU7XG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAgIC5nZXRJbnB1dFR5cGUodGhpcy5pbnB1dFZhbHVlLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICB9XG5cbiAgb25DaGFuZ2VDYWxsYmFjayhfOiBhbnkpIHtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgfVxuXG4gIHZhbGlkYXRlKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBhbnkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlIHx8IHRoaXMubWluVGltZSB8fCB0aGlzLm1heFRpbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCkgPT4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh2YWx1ZTogTW9tZW50KTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmdldFRpbWVGb3JtYXQodGhpcy5jb21wb25lbnRDb25maWcpLFxuICAgICAgW3ZhbHVlXSxcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnJldHVybmVkVmFsdWVUeXBlIHx8IHRoaXMuaW5wdXRWYWx1ZVR5cGVcbiAgICApO1xuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKSB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge1xuICAgICAgICBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsXG4gICAgICAgIG1heERhdGU6IHRoaXMubWF4RGF0ZSxcbiAgICAgICAgbWluVGltZTogdGhpcy5taW5UaW1lLFxuICAgICAgICBtYXhUaW1lOiB0aGlzLm1heFRpbWVcbiAgICAgIH0sIHVuZGVmaW5lZCwgJ2RheScpO1xuXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZCkpO1xuICB9XG5cbiAgZGVjcmVhc2UodW5pdDogVGltZVVuaXQpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5kZWNyZWFzZSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5zZWxlY3RlZCwgdW5pdCk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBpbmNyZWFzZSh1bml0OiBUaW1lVW5pdCkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLmluY3JlYXNlKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLnNlbGVjdGVkLCB1bml0KTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIHRvZ2dsZU1lcmlkaWVtKCkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnRpbWVTZWxlY3RTZXJ2aWNlLnRvZ2dsZU1lcmlkaWVtKHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe2RhdGU6IHRoaXMuc2VsZWN0ZWQsIHNlbGVjdGVkOiBmYWxzZX0pO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBjYWxjdWxhdGVUaW1lUGFydHModGltZTogTW9tZW50KSB7XG4gICAgdGhpcy5ob3VycyA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0SG91cnModGhpcy5jb21wb25lbnRDb25maWcsIHRpbWUpO1xuICAgIHRoaXMubWludXRlcyA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0TWludXRlcyh0aGlzLmNvbXBvbmVudENvbmZpZywgdGltZSk7XG4gICAgdGhpcy5zZWNvbmRzID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRTZWNvbmRzKHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aW1lKTtcbiAgICB0aGlzLm1lcmlkaWVtID0gdGhpcy50aW1lU2VsZWN0U2VydmljZS5nZXRNZXJpZGllbSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGltZSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNvbmZpZ0NoYW5nZShjb25maWc6IFNpbXBsZUNoYW5nZSkge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIGNvbnN0IHByZXZDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5wcmV2aW91c1ZhbHVlKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMudGltZVNlbGVjdFNlcnZpY2UuZ2V0Q29uZmlnKGNvbmZpZy5jdXJyZW50VmFsdWUpO1xuXG4gICAgICBpZiAocHJldkNvbmYubG9jYWxlICE9PSBjdXJyZW50Q29uZi5sb2NhbGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQuY2xvbmUoKS5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==