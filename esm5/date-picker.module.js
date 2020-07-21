import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerDirective } from './date-picker/date-picker.directive';
import { DayCalendarComponent } from './day-calendar/day-calendar.component';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { CalendarNavComponent } from './calendar-nav/calendar-nav.component';
import { DayTimeCalendarComponent } from './day-time-calendar/day-time-calendar.component';
export { DatePickerComponent } from './date-picker/date-picker.component';
export { DatePickerDirective } from './date-picker/date-picker.directive';
export { DayCalendarComponent } from './day-calendar/day-calendar.component';
export { DayTimeCalendarComponent } from './day-time-calendar/day-time-calendar.component';
export { TimeSelectComponent } from './time-select/time-select.component';
export { MonthCalendarComponent } from './month-calendar/month-calendar.component';
var DpDatePickerModule = /** @class */ (function () {
    function DpDatePickerModule() {
    }
    DpDatePickerModule = __decorate([
        NgModule({
            declarations: [
                DatePickerComponent,
                DatePickerDirective,
                DayCalendarComponent,
                MonthCalendarComponent,
                CalendarNavComponent,
                TimeSelectComponent,
                DayTimeCalendarComponent
            ],
            entryComponents: [
                DatePickerComponent
            ],
            imports: [
                CommonModule,
                FormsModule
            ],
            exports: [
                DatePickerComponent,
                DatePickerDirective,
                MonthCalendarComponent,
                DayCalendarComponent,
                TimeSelectComponent,
                DayTimeCalendarComponent
            ]
        })
    ], DpDatePickerModule);
    return DpDatePickerModule;
}());
export { DpDatePickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFFekYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDekYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUE0QmpGO0lBQUE7SUFDQSxDQUFDO0lBRFksa0JBQWtCO1FBMUI5QixRQUFRLENBQUM7WUFDUixZQUFZLEVBQUU7Z0JBQ1osbUJBQW1CO2dCQUNuQixtQkFBbUI7Z0JBQ25CLG9CQUFvQjtnQkFDcEIsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsd0JBQXdCO2FBQ3pCO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLG1CQUFtQjthQUNwQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxZQUFZO2dCQUNaLFdBQVc7YUFDWjtZQUNELE9BQU8sRUFBRTtnQkFDUCxtQkFBbUI7Z0JBQ25CLG1CQUFtQjtnQkFDbkIsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLG1CQUFtQjtnQkFDbkIsd0JBQXdCO2FBQ3pCO1NBQ0YsQ0FBQztPQUNXLGtCQUFrQixDQUM5QjtJQUFELHlCQUFDO0NBQUEsQUFERCxJQUNDO1NBRFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RGF0ZVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRlUGlja2VyRGlyZWN0aXZlfSBmcm9tICcuL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmRpcmVjdGl2ZSc7XG5pbXBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7TW9udGhDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi9tb250aC1jYWxlbmRhci9tb250aC1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtUaW1lU2VsZWN0Q29tcG9uZW50fSBmcm9tICcuL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQge0NhbGVuZGFyTmF2Q29tcG9uZW50fSBmcm9tICcuL2NhbGVuZGFyLW5hdi9jYWxlbmRhci1uYXYuY29tcG9uZW50JztcbmltcG9ydCB7RGF5VGltZUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cbmV4cG9ydCB7RGF0ZVBpY2tlckNvbXBvbmVudH0gZnJvbSAnLi9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuZXhwb3J0IHtEYXRlUGlja2VyRGlyZWN0aXZlfSBmcm9tICcuL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmRpcmVjdGl2ZSc7XG5leHBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuY29tcG9uZW50JztcbmV4cG9ydCB7RGF5VGltZUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5leHBvcnQge1RpbWVTZWxlY3RDb21wb25lbnR9IGZyb20gJy4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50JztcbmV4cG9ydCB7TW9udGhDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi9tb250aC1jYWxlbmRhci9tb250aC1jYWxlbmRhci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBEYXRlUGlja2VyQ29tcG9uZW50LFxuICAgIERhdGVQaWNrZXJEaXJlY3RpdmUsXG4gICAgRGF5Q2FsZW5kYXJDb21wb25lbnQsXG4gICAgTW9udGhDYWxlbmRhckNvbXBvbmVudCxcbiAgICBDYWxlbmRhck5hdkNvbXBvbmVudCxcbiAgICBUaW1lU2VsZWN0Q29tcG9uZW50LFxuICAgIERheVRpbWVDYWxlbmRhckNvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBEYXRlUGlja2VyQ29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIERhdGVQaWNrZXJDb21wb25lbnQsXG4gICAgRGF0ZVBpY2tlckRpcmVjdGl2ZSxcbiAgICBNb250aENhbGVuZGFyQ29tcG9uZW50LFxuICAgIERheUNhbGVuZGFyQ29tcG9uZW50LFxuICAgIFRpbWVTZWxlY3RDb21wb25lbnQsXG4gICAgRGF5VGltZUNhbGVuZGFyQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRHBEYXRlUGlja2VyTW9kdWxlIHtcbn1cbiJdfQ==