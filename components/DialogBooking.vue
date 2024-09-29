<template>
  <v-dialog v-model="dialog" persistent fullscreen>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="props.appearance == 'add'"
        v-bind="activatorProps"
        color="primary"
        dark
        variant="tonal"
        style="height: 41px; min-width: 41px; padding: 0 10px"
      >
        <span style="font-size: 24px">+</span>
      </v-btn>
      <v-btn
        v-if="props.appearance == 'float'"
        v-bind="activatorProps"
        style="position: absolute; top: 35px; right: -10px"
        size="small"
        density="compact"
        dark
        icon="mdi-plus"
      >
      </v-btn>
      <v-btn
        v-if="props.appearance == 'edit'"
        color="primary"
        dark
        v-bind="activatorProps"
        icon="mdi-pencil"
        density="comfortable"
        size="small"
        variant="tonal"
      >
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" density="comfortable">
        <v-container class="d-flex justify-space-between align-center">
          <v-toolbar-title style="flex: 4 1">{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-container>
      </v-toolbar>

      <v-container class="pa-0">
        <v-stepper v-model="step" class="mobile" hide-actions alt-labels>
          <v-stepper-header>
            <v-stepper-item
              title="จอง"
              value="1"
              editable
              :complete="['จอง', 'มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :color="['จอง', 'มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status) ? 'success' : ''"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="มัดจำ"
              value="2"
              :editable="['จอง', 'มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :complete="['มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :color="['มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status) ? 'success' : ''"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="รับรถ"
              value="3"
              :editable="['มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :complete="['รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :color="['รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status) ? 'success' : ''"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="คืนรถ"
              value="4"
              :editable="['รับรถ', 'คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :complete="['คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :color="['คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status) ? 'success' : ''"
            ></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="คืนมัดจำ"
              value="5"
              :editable="['คืนรถ', 'คืนมัดจำ'].includes(formData.booking_status)"
              :complete="['คืนมัดจำ'].includes(formData.booking_status)"
              :color="['คืนมัดจำ'].includes(formData.booking_status) ? 'success' : ''"
            ></v-stepper-item>
          </v-stepper-header>
          <v-stepper-window :style="`height: ${innerHeight - 170}px;`">
            <v-stepper-window-item value="1">
              <div class="mb-3 border rounded-lg">
                <v-tabs v-model="tab" color="primary" align-tabs="center">
                  <v-tab>ข้อมูล</v-tab>
                  <v-tab>รูป/ไฟล์</v-tab>
                </v-tabs>
              </div>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item>
                  <v-form ref="form" lazy-validation @submit.prevent="onSubmit()">
                    <v-divider>ข้อมูลเบื้องต้น</v-divider>
                    <v-row class="mt-3" no-gutters>
                      <v-col cols="4" class="d-flex align-center">วันจอง</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3"
                          v-model="formData.booking_date"
                          type="datetime-local"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">
                        <div>ลูกค้า</div>
                        <DialogCustomer appearance="icon" actionType="add" @success="getCustomers()" />
                      </v-col>
                      <v-col>
                        <v-autocomplete
                          class="pl-3"
                          v-model="formData.customer_id"
                          :items="customers"
                          item-title="customer_name"
                          item-value="id"
                          density="compact"
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item
                              v-bind="props"
                              :title="item.raw.customer_name"
                              :subtitle="item.raw.customer_tel"
                            >
                              <template v-slot:append>
                                <v-btn
                                  color="grey-lighten-1"
                                  icon="mdi-information"
                                  :key="item.id"
                                  variant="text"
                                  @click="
                                    customer_id = item.raw.id;
                                    dialogCustomer = true;
                                  "
                                ></v-btn>
                              </template>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">รถเช่า</v-col>
                      <v-col>
                        <v-autocomplete
                          class="pl-3"
                          v-model="formData.car_id"
                          :items="cars"
                          item-title="license_plate"
                          item-value="id"
                          density="compact"
                          hide-details
                          @update:modelValue="changeCar()"
                          :rules="[(value) => !!value || 'Required.']"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item
                              v-bind="props"
                              :prepend-avatar="
                                item.raw.uploads.length ? $getImage(item.raw.uploads[0].file_path) : $imageBaseApp()
                              "
                              :title="item.raw.license_plate"
                            >
                              <div class="d-flex" style="font-size: 0.875rem; color: grey">
                                {{ item.raw.car_model.car_model_name }} | {{ item.raw.year }} |
                                <b style="color: green" class="mx-1">{{ item.raw.rental_per_day.toLocaleString() }}</b>
                                |

                                <v-chip
                                  :color="item.raw.color_code"
                                  label
                                  variant="flat"
                                  density="compact"
                                  size="small"
                                >
                                  {{ item.raw.color }}
                                </v-chip>
                                |
                                <v-chip :color="item.raw.branch.branch_color" label density="compact" size="small">
                                  {{ item.raw.branch.branch_name }}
                                </v-chip>
                              </div>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row v-if="actionType == 'edit'" class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">สถานะงาน</v-col>
                      <v-col>
                        <v-select
                          class="ml-3"
                          :items="['จอง', 'มัดจำ', 'รับรถ', 'คืนรถ', 'คืนมัดจำ', 'ยกเลิก']"
                          v-model="formData.booking_status"
                          density="compact"
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <br />
                    <v-divider>การรับคืนรถ</v-divider>

                    <v-row class="mt-3" no-gutters>
                      <v-col cols="4" class="d-flex align-center">วันรับรถ</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3"
                          v-model="formData.pickup_date"
                          type="datetime-local"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex align-center">สถานที่รับรถ</v-col>
                      <v-col>
                        <v-combobox
                          class="pl-3"
                          v-model="formData.pickup_location"
                          :items="['สถานบิน', 'บริษัท']"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-combobox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex align-center">สาขา</v-col>
                      <v-col>
                        <v-select
                          class="pl-3"
                          v-model="formData.pickup_branch_id"
                          :items="branches"
                          item-title="branch_name"
                          item-value="id"
                          density="compact"
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row class="mt-3" no-gutters>
                      <v-col cols="4" class="d-flex align-center">วันคืนรถ</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3"
                          v-model="formData.return_date"
                          type="datetime-local"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex align-center">สถานที่คืนรถ</v-col>
                      <v-col>
                        <v-combobox
                          class="pl-3"
                          v-model="formData.return_location"
                          :items="['สถานบิน', 'บริษัท']"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-combobox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex align-center">สาขา</v-col>
                      <v-col>
                        <v-select
                          class="pl-3"
                          v-model="formData.return_branch_id"
                          :items="branches"
                          item-title="branch_name"
                          item-value="id"
                          density="compact"
                          hide-details
                          :rules="[(value) => !!value || 'Required.']"
                        >
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row class="mt-3" no-gutters>
                      <v-col cols="4" class="d-flex align-center">ระยะเวลา</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 pr-1"
                          v-model="period_day"
                          suffix=" วัน"
                          density="compact"
                          hide-details
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="period_remain_hours"
                          suffix=" ชั่วโมง"
                          density="compact"
                          hide-details
                          readonly
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <br />
                    <v-divider>ข้อมูลราคา</v-divider>
                    <v-row class="mt-3" no-gutters>
                      <v-col cols="4" class="d-flex align-center">ค่าเช่าต่อวัน</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.rental_per_day"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          @keyup="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">ค่าเช่าทั้งหมด</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.rental"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          readonly
                          bg-color="white"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center"> คนขับ </v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.driver_per_day"
                          type="number"
                          :prepend-inner-icon="
                            formData.required_driver ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'
                          "
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          @click:prepend-inner="
                            formData.required_driver = !formData.required_driver;
                            getDriverPrice();
                          "
                          @keyup="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">ค่าเช่าเพิ่มเติม</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.extra_charge"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          readonly
                          @keyup="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">ส่วนลด</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.discount"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          @keyup="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">รวม</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.sub_total"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          readonly
                          bg-color="white"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">% Vat</v-col>
                      <v-col cols="3">
                        <v-select
                          class="pl-3"
                          :items="[0, 7]"
                          v-model.number="formData.vat_percent"
                          density="compact"
                          suffix="%"
                          menu-icon=""
                          :reverse="false"
                          hide-details
                          @update:model-value="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="pl-1 right-input"
                          v-model.number="formData.vat_amount"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">รวมทั้งหมด</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.total"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          readonly
                          bg-color="white"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">มัดจำ</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.deposit"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          @keyup="calPrice()"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">รวมสุทธิ</v-col>
                      <v-col>
                        <v-text-field
                          class="pl-3 right-input"
                          v-model.number="formData.net_total"
                          type="number"
                          append-inner-icon="mdi-currency-thb"
                          density="compact"
                          outlined
                          dense
                          hide-details
                          readonly
                          bg-color="white"
                          :rules="[(value) => !isNaN(parseFloat(value)) || 'Must be a number']"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row class="mt-1" no-gutters>
                      <v-col cols="4" class="d-flex align-center">หมายเหตุ</v-col>
                      <v-col>
                        <v-textarea
                          class="pl-3 right-input"
                          rows="2"
                          v-model="formData.booking_note"
                          density="compact"
                          outlined
                          dense
                          hide-details
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>

                    <v-btn
                      v-if="props.actionType == 'edit' && formData.booking_status == 'ระงับการใช้งาน'"
                      class="mt-5"
                      color="error"
                      variant="tonal"
                      size="large"
                      block
                      @click="
                        dialogDelete = true;
                        id = formData.id;
                      "
                    >
                      ลบข้อมูล
                    </v-btn>

                    <v-btn class="mt-5 mb-5" type="submit" color="primary" block size="large" variant="tonal">
                      บันทึก
                    </v-btn>
                  </v-form>
                </v-tabs-window-item>
                <v-tabs-window-item>
                  <p>รูปภาพ ({{ images.length }})</p>
                  <v-row no-gutters v-viewer>
                    <v-col lg="2" md="3" sm="3" cols="4" class="px-1 mb-2" v-for="image in images" :key="image.id">
                      <v-card style="height: 90px" variant="text">
                        <v-img
                          style="border-radius: 6px"
                          height="100%"
                          cover
                          :src="$getImage(image.file_path)"
                          :lazy-src="$getImage(image.file_path)"
                        />
                        <v-btn
                          style="top: 0px; right: 0px; position: absolute; z-index: 2000"
                          color="red"
                          icon="mdi-delete"
                          density="comfortable"
                          size="small"
                          variant="tonal"
                          @click="
                            dialogDeleteImage = true;
                            imageId = image.id;
                          "
                        >
                        </v-btn>
                      </v-card>
                    </v-col>
                    <v-col lg="2" md="3" sm="3" cols="4" class="px-1">
                      <v-card variant="outlined" height="90" style="border: 1px solid #ddd">
                        <ImageUpload
                          :booking_id="props.id"
                          type="bookings"
                          location="bookings"
                          :loading="loadingImage"
                          @success="getImages()"
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                  <p class="mt-3">ไฟล์ ({{ files.length }})</p>
                  <v-list-item
                    v-for="file in files"
                    :key="file.id"
                    :value="file.id"
                    class="py-0 px-0"
                    style="min-height: 0px"
                  >
                    <v-list-item-title>
                      <v-btn
                        class="mr-1"
                        color="primary"
                        icon="mdi-file"
                        density="comfortable"
                        size="small"
                        variant="text"
                      >
                      </v-btn>
                      <a :href="$getImage(file.file_path)" target="_blank">
                        {{ file.file_name }}
                      </a>
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-btn
                        color="red"
                        icon="mdi-delete"
                        density="comfortable"
                        size="small"
                        variant="tonal"
                        @click="
                          dialogDeleteImage = true;
                          imageId = file.id;
                        "
                      >
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              <BookingComDeposit
                :booking_id="formData.id"
                :car_id="formData.car_id"
                :booking_status="formData.booking_status"
                @success="success()"
              />
            </v-stepper-window-item>
            <v-stepper-window-item value="3">
              <BookingComPickup
                :step="step"
                :booking_id="formData.id"
                :booking_status="formData.booking_status"
                @success="success()"
              />
            </v-stepper-window-item>
            <v-stepper-window-item value="4">
              <BookingComReturn
                :step="step"
                :booking_id="formData.id"
                :booking_status="formData.booking_status"
                @success="success()"
              />
            </v-stepper-window-item>
            <v-stepper-window-item value="5">
              <BookingComRefund
                :step="step"
                :booking_id="formData.id"
                :car_id="formData.car_id"
                :booking_status="formData.booking_status"
                @success="success()"
              />
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-container>
    </v-card>

    <!-- <DialogLoader :loading="loading" /> -->
    <DialogCustomer
      :dialog="dialogCustomer"
      :id="customer_id"
      actionType="edit"
      @success="getCustomers()"
      @close="dialogCustomer = false"
    />
    <DialogDelete :dialogDelete="dialogDelete" @cancleItem="dialogDelete = false" @deleteItem="deleteItem" />
    <DialogDelete :dialogDelete="dialogDeleteImage" @cancleItem="dialogDeleteImage = false" @deleteItem="deleteImage" />
  </v-dialog>
</template>

<script setup>
const dayjs = useDayjs();
const props = defineProps({
  dialog: { type: Boolean, default: false },
  actionType: String,
  appearance: String,
  id: Number,
  car_id: Number,
  branch_id: Number,
});
const { $toast } = useNuxtApp();
const emit = defineEmits(["success", "close"]);

//Set common variable
const innerHeight = ref(window.innerHeight);
const step = ref("1");
const dialog = ref(false);
const loading = ref(true);
const formData = ref({});
const formTitle = ref("");
const tab = ref(0);

onMounted(() => {
  getCars();
  getBranches();
  getCustomers();
});

const cars = ref([]);
const getCars = async () => {
  const response = await useApiCars().index();
  cars.value = response.data.filter((item) => item.car_status == "เปิดใช้งาน");
};

const branches = ref([]);
const getBranches = async () => {
  const response = await useApiBranches().index();
  branches.value = response.data.filter((item) => item.branch_status == "เปิดใช้งาน");
};

const dialogCustomer = ref(false);
const customer_id = ref(0);
const customers = ref([]);
const getCustomers = async () => {
  const response = await useApiCustomers().index();
  customers.value = response.data.filter((item) => item.customer_status == "เปิดใช้งาน");
};

const period_day = computed({
  get() {
    if (formData.value.pickup_date && formData.value.return_date) {
      const date1 = dayjs(formData.value.pickup_date);
      const date2 = dayjs(formData.value.return_date);
      const diffInDays = date2.diff(date1, "day");
      return Math.max(diffInDays, 0);
    }
    return 0;
  },
  set(newValue) {},
});

const period_remain_hours = computed({
  get() {
    if (formData.value.pickup_date && formData.value.return_date) {
      const date1 = dayjs(formData.value.pickup_date);
      const date2 = dayjs(formData.value.return_date);
      const diffInDays = date2.diff(date1, "day");
      const remainingHours = date2.diff(date1.add(diffInDays, "day"), "hour");
      return Math.max(remainingHours, 0);
    }
    return 0;
  },
  set(newValue) {},
});

const car = computed(() => cars.value.find((item) => item.id == formData.value.car_id));
const changeCar = () => {
  formData.value.branch_id = car.value ? car.value.branch_id : null;
  formData.value.pickup_branch_id = car.value ? car.value.branch_id : null;
  formData.value.return_branch_id = car.value ? car.value.branch_id : null;
  getRentalPrice();
  getDriverPrice();
  calPrice();
};
const getRentalPrice = () => {
  formData.value.rental_per_day = car.value ? car.value.rental_per_day : 0;
  formData.value.deposit = car.value ? car.value.deposit : 0;
};

const getDriverPrice = () => {
  const { excess_houre_charge } = car.value || {};
  const days = period_day.value || 0;
  const remainingHours = period_remain_hours.value || 0;
  // Calculate driver cost if applicable
  formData.value.driver_per_day = formData.value.required_driver
    ? car.value.driver_per_day * (remainingHours > excess_houre_charge ? days + 1 : days)
    : 0;
  calPrice();
};

watch(
  () => [period_day.value, period_remain_hours.value],
  () => {
    getDriverPrice();
    calPrice();
  }
);
const calPrice = () => {
  const { discount, vat_percent, deposit } = formData.value;
  const { excess_houre_free, excess_houre_charge, excess_price } = car.value || {};

  const days = period_day.value || 0;
  const remainingHours = period_remain_hours.value || 0;

  // Calculate base rental cost
  formData.value.rental = formData.value.rental_per_day * (remainingHours > excess_houre_charge ? days + 1 : days);

  // Calculate extra charge if applicable
  formData.value.extra_charge = 0;
  if (remainingHours > excess_houre_free && remainingHours < excess_houre_charge) {
    formData.value.extra_charge = excess_price * remainingHours;
  }

  // Calculate subtotal
  formData.value.sub_total =
    formData.value.rental + formData.value.driver_per_day + formData.value.extra_charge - discount;

  // Calculate VAT and total
  formData.value.vat_amount = (formData.value.sub_total * vat_percent) / 100;
  formData.value.total = formData.value.sub_total + formData.value.vat_amount;

  // Calculate net total
  formData.value.net_total = formData.value.total + deposit;
};

// Get Data
const getData = async () => {
  loading.value = true;
  const response = await useApiBookings().show(props.id);
  delete response.data.customer;
  delete response.data.pickup_branch;
  delete response.data.return_branch;
  delete response.data.car;
  delete response.data.booking_pickups;
  delete response.data.booking_returns;
  delete response.data.account_transactions;
  formData.value = response.data;
  formData.value.booking_date = useGlobalFunction().toDatetimeLocal(response.data.booking_date);
  formData.value.pickup_date = useGlobalFunction().toDatetimeLocal(response.data.pickup_date);
  formData.value.return_date = useGlobalFunction().toDatetimeLocal(response.data.return_date);
  formTitle.value = "Booking No : " + response.data.booking_number;
  loading.value = false;
};

// Get Images
const images = ref([]);
const files = ref([]);
const loadingImage = ref(false);
const getImages = async () => {
  loadingImage.value = true;
  images.value = [];
  files.value = [];
  const response = await useApiUploads().index(props.id, "bookings");
  await response.data.map((item) => {
    const extension = item.extension.split("/");
    if (extension[0] == "image") {
      images.value.push(item);
    } else {
      files.value.push(item);
    }
  });
  loadingImage.value = false;
};
watch(
  () => tab.value,
  (value) => {
    if (value == 1) {
      getImages();
    }
  }
);

const dialogDeleteImage = ref(false);
const imageId = ref(0);
const deleteImage = async () => {
  loadingImage.value = true;
  dialogDeleteImage.value = false;
  const response = await useApiUploads().destroy(imageId.value);
  response.status == 200
    ? ($toast.success("ลบสำเร็จ"), getImages())
    : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  loadingImage.value = false;
};

// Submit Data
const form = ref(null);
const onSubmit = async () => {
  const formValue = form.value;
  const validate = await formValue.validate();
  if (validate.valid) {
    loading.value = true;
    if (props.actionType == "add") {
      const response = await useApiBookings().store(formData.value);
      response.status == 201
        ? ($toast.success("ทำรายการสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    } else {
      const response = await useApiBookings().update(formData.value.id, formData.value);
      response.status == 200
        ? ($toast.success("แก้ไขข้อมูลสำเร็จ"), (dialog.value = false), emit("success"))
        : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
    }
    loading.value = false;
  }
};

const success = () => {
  getData();
  emit("success");
};

const id = ref(0);
const dialogDelete = ref(false);
const deleteItem = async () => {
  loading.value = true;
  dialogDelete.value = false;
  const response = await useApiBookings().destroy(id.value);
  response.status == 200
    ? ($toast.success("ลบสำเร็จ"), (dialog.value = false), emit("success"))
    : $toast.error("เกิดข้อผิดพลาด! กรุณาติดต่อผู้แลระบบ");
  loading.value = false;
};

const onClose = () => {
  dialog.value = false;
  emit("close");
};

// Check dialog isOpen
watch(dialog, (value) => {
  if (value) {
    nextTick(() => {
      step.value = "1";
      tab.value = 0;
      formData.value = {};
      form.value ? form.value.reset() : "";
      nextTick(() => {
        if (props.actionType == "add") {
          formTitle.value = "เพิ่มข้อมูล";
          formData.value.pickup_location = "สถานบิน";
          formData.value.return_location = "สถานบิน";
          formData.value.extra_charge = 0;
          formData.value.discount = 0;
          formData.value.car_id = props.car_id ?? null;
          formData.value.branch_id = props.branch_id ?? null;
          formData.value.pickup_branch_id = props.branch_id ?? null;
          formData.value.return_branch_id = props.branch_id ?? null;
          formData.value.vat_percent = 0;
          getRentalPrice();
          getDriverPrice();
          calPrice();
          loading.value = false;
        } else {
          formTitle.value = "แก้ไขข้อมูล";
          getData();
        }
      });
    });
  } else {
    onClose();
  }
});

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  }
);
</script>

<style scoped>
.right-input :deep() input {
  text-align: right;
}
</style>
