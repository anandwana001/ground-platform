/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject, NgZone } from '@angular/core';
import { DataImportService } from './../../services/data-import/data-import.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss'],
})
export class ImportDialogComponent {
  private projectId: string;
  private layerId: string;
  public readonly acceptedExtensions = 'csv,geojson';
  uploadForm: FormGroup;
  public files: Array<File> = [];
  isUploadingCSV = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { projectId: string; layerId: string },
    private formBuilder: FormBuilder,
    private dataImportService: DataImportService,
    private readonly dialogRef: MatDialogRef<ImportDialogComponent>,
    private readonly notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    this.projectId = data.projectId;
    this.layerId = data.layerId;
    this.uploadForm = this.formBuilder.group({
      file: new FormControl(),
    });
  }

  async importCsv(): Promise<void> {
    const files = this.uploadForm.get('file')?.value;
    if (!files || files.length === 0) {
      console.error('File missing');
      return;
    }
    try {
      this.isUploadingCSV = true;
      await this.dataImportService.importCsv(
        this.projectId,
        this.layerId,
        files[0] as File
      );
      this.notificationService.success('Csv import completed');
    } catch (err) {
      this.notificationService.error('Csv import failed');
    }
    this.isUploadingCSV = false;
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
}
