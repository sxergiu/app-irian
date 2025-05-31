import { Component, inject, signal, computed } from '@angular/core';
import { GroupService } from './groups.service';
import { CommonModule } from '@angular/common';
import {GroupModel} from './domain/group.models';

@Component({
  selector: 'app-named-groups',
  templateUrl: './named-groups.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./named-groups.component.scss']
})
export class NamedGroupsComponent {
  private readonly groupService = inject(GroupService);


  selectedFile = signal<File | null>(null);
  groups = signal<GroupModel[]>([]);
  uploadResponse = signal<string>('');
  isLoading = signal<boolean>(false);
  isUploading = signal<boolean>(false);

  hasSelectedFile = computed(() => this.selectedFile() !== null);
  hasGroups = computed(() => this.groups().length > 0);
  canUpload = computed(() => this.hasSelectedFile() && !this.isUploading());

  constructor() {
    this.fetchGroups();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile.set(file);

    if (file) {
      this.uploadResponse.set('');
    }
  }

  private clearFileInput(): void {
    // Clear the file input element
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.uploadResponse.set('');

    this.groupService.uploadGroupFile(file).subscribe({
      next: (response) => {
        this.uploadResponse.set(`Success: ${response}`);
        this.selectedFile.set(null);
        this.clearFileInput();
        this.fetchGroups();
        this.isUploading.set(false);
      },
      error: (error) => {
        this.uploadResponse.set(`Please upload a valid .csv file!`);
        this.selectedFile.set(null);
        this.clearFileInput();
        this.isUploading.set(false);
      }
    });
  }

  fetchGroups(): void {
    this.isLoading.set(true);

    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.groups.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.uploadResponse.set(`Server fetch error: ${error}`);
        this.isLoading.set(false);
      }
    });
  }

  clearResponse(): void {
    this.uploadResponse.set('');
  }
}
