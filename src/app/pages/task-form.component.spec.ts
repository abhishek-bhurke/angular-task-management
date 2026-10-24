import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('requires a title and rejects titles shorter than three characters', () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('');
    expect(component.form.controls.title.hasError('required')).toBeTrue();
    component.form.controls.title.setValue('ab');
    expect(component.form.controls.title.hasError('minlength')).toBeTrue();
    component.form.controls.title.setValue('Valid title');
    expect(component.form.controls.title.valid).toBeTrue();
  });
});