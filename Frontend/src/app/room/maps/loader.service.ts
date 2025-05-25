import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private apiLoaded = false;
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    // Already loaded
    if (this.apiLoaded || (window as any).google?.maps?.places) {
      this.apiLoaded = true;
      return Promise.resolve();
    }

    // Already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Begin loading
    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };

      script.onerror = () => {
        console.error('Google Maps failed to load');
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
