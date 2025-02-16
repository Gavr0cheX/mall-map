import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.page.html',
  styleUrls: ['./floor.page.scss'],
})
export class FloorPage implements OnInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  sectionTitle: string = ''; // Title of the clicked section
  sectionDetails: string = ''; // Details of the clicked section
  isDesktop: boolean = false; // Flag to check if it's desktop
  isModalOpen: boolean = false;
  modalTitle: string = '';
  modalDescription: string = '';

  constructor(private renderer: Renderer2, private menuCtrl: MenuController, private platform: Platform) {

  }

  isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  }

  ngOnInit() {
    this.checkPlatform();
    this.loadSvg('assets/floor-map.svg');

  }

  ionViewDidEnter() {
    const elements = document.querySelectorAll('#svgContainer path, #svgContainer polygon');
    console.log(elements)
    elements.forEach((element, index) => {
      element.setAttribute('id', `store-${index + 1}`);
    });
    console.log('IDs have been added.');
  }

  // Check if the app is running on desktop
  checkPlatform() {
    this.isDesktop = this.platform.is('desktop') || window.innerWidth > 768;
  }

  // Open sidebar with dynamic content
  openSidebar(title: string, details: string) {
    this.sectionTitle = title;
    this.sectionDetails = details;

    if (this.isDesktop) {
      this.menuCtrl.open();
    } else {
      console.log('Sidebar disabled on mobile');
    }
  }

  handleClick(title: string, description: string): void {
    if (this.isMobileDevice()) {
      // Open the modal for mobile devices
      this.modalTitle = title;
      this.modalDescription = description;
      this.isModalOpen = true;
    } else {
      // Handle sidebar logic here for desktop
      this.openSidebar(title, description) 

      console.log('Open sidebar with:', title, description);
    }
  }

  loadSvg(svgPath: string) {
    fetch(svgPath)
      .then((res) => res.text())
      .then((svg) => {
        const parser = new DOMParser();
        const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;
        this.renderer.appendChild(this.svgContainer.nativeElement, svgElement);
      });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
