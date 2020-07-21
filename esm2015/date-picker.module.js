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
let DpDatePickerModule = class DpDatePickerModule {
};
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
export { DpDatePickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmcyLWRhdGUtcGlja2VyLyIsInNvdXJjZXMiOlsiZGF0ZS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFFekYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDekYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUE0QmpGLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0NBQzlCLENBQUE7QUFEWSxrQkFBa0I7SUExQjlCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLG1CQUFtQjtZQUNuQixtQkFBbUI7WUFDbkIsb0JBQW9CO1lBQ3BCLHNCQUFzQjtZQUN0QixvQkFBb0I7WUFDcEIsbUJBQW1CO1lBQ25CLHdCQUF3QjtTQUN6QjtRQUNELGVBQWUsRUFBRTtZQUNmLG1CQUFtQjtTQUNwQjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVk7WUFDWixXQUFXO1NBQ1o7UUFDRCxPQUFPLEVBQUU7WUFDUCxtQkFBbUI7WUFDbkIsbUJBQW1CO1lBQ25CLHNCQUFzQjtZQUN0QixvQkFBb0I7WUFDcEIsbUJBQW1CO1lBQ25CLHdCQUF3QjtTQUN6QjtLQUNGLENBQUM7R0FDVyxrQkFBa0IsQ0FDOUI7U0FEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybXNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEYXRlUGlja2VyQ29tcG9uZW50fSBmcm9tICcuL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQge0RhdGVQaWNrZXJEaXJlY3RpdmV9IGZyb20gJy4vZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7RGF5Q2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtNb250aENhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge1RpbWVTZWxlY3RDb21wb25lbnR9IGZyb20gJy4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50JztcbmltcG9ydCB7Q2FsZW5kYXJOYXZDb21wb25lbnR9IGZyb20gJy4vY2FsZW5kYXItbmF2L2NhbGVuZGFyLW5hdi5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50JztcblxuZXhwb3J0IHtEYXRlUGlja2VyQ29tcG9uZW50fSBmcm9tICcuL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmNvbXBvbmVudCc7XG5leHBvcnQge0RhdGVQaWNrZXJEaXJlY3RpdmV9IGZyb20gJy4vZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlJztcbmV4cG9ydCB7RGF5Q2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5jb21wb25lbnQnO1xuZXhwb3J0IHtEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50JztcbmV4cG9ydCB7VGltZVNlbGVjdENvbXBvbmVudH0gZnJvbSAnLi90aW1lLXNlbGVjdC90aW1lLXNlbGVjdC5jb21wb25lbnQnO1xuZXhwb3J0IHtNb250aENhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIERhdGVQaWNrZXJDb21wb25lbnQsXG4gICAgRGF0ZVBpY2tlckRpcmVjdGl2ZSxcbiAgICBEYXlDYWxlbmRhckNvbXBvbmVudCxcbiAgICBNb250aENhbGVuZGFyQ29tcG9uZW50LFxuICAgIENhbGVuZGFyTmF2Q29tcG9uZW50LFxuICAgIFRpbWVTZWxlY3RDb21wb25lbnQsXG4gICAgRGF5VGltZUNhbGVuZGFyQ29tcG9uZW50XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuICAgIERhdGVQaWNrZXJDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRGF0ZVBpY2tlckNvbXBvbmVudCxcbiAgICBEYXRlUGlja2VyRGlyZWN0aXZlLFxuICAgIE1vbnRoQ2FsZW5kYXJDb21wb25lbnQsXG4gICAgRGF5Q2FsZW5kYXJDb21wb25lbnQsXG4gICAgVGltZVNlbGVjdENvbXBvbmVudCxcbiAgICBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEcERhdGVQaWNrZXJNb2R1bGUge1xufVxuIl19