import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fe-eonite';
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let loader = this.renderer.selectRootElement('#loader');
      if (loader.style.display != "none") loader.style.display = "none"; //hide loader
      console.log("test view init")
    }
  }
}
