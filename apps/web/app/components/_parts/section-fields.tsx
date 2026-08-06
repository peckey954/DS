"use client";

import * as React from "react";
import { CopyIcon, MailIcon, SearchIcon } from "lucide-react";

import { Input } from "@peckey954/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@peckey954/ui/components/ui/input-group";
import { Label } from "@peckey954/ui/components/ui/label";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@peckey954/ui/components/ui/multi-select";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@peckey954/ui/components/ui/native-select";
import { NumberInput } from "@peckey954/ui/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@peckey954/ui/components/ui/select";
import { Textarea } from "@peckey954/ui/components/ui/textarea";
import { cn } from "@peckey954/ui/lib/utils";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    statesHint: "บังคับกรอก · ไม่บังคับ · คำใบ้ · ผิดพลาด",
    inputHint: "ช่องกรอกพื้นฐาน",
    inputGroupHint: "ไอคอน / ข้อความ / ปุ่ม ในช่องเดียว",
    numberHint: "ปุ่ม − / + · ทศนิยม 2 ตำแหน่ง",
    unitHint: "หน่วยในช่อง ไม่มีปุ่ม",
    textareaHint: "ข้อความหลายบรรทัด",
    selectHint: "ดรอปดาวน์ของ shadcn",
    selectErrorHint: "สถานะผิดพลาด",
    nativeHint: "ดรอปดาวน์ของเบราว์เซอร์ — บนมือถือใช้ตัวเลือกของระบบ",
    multiHint: "เลือกหลายรายการ (ของเราเอง)",
    multiErrorHint: "เลือกหลายรายการ · สถานะผิดพลาด",

    required: "บังคับกรอก",
    optional: "ไม่บังคับ",

    docNo: "เลขที่เอกสาร",
    docHint: "รูปแบบ PO ตามด้วยปีและเดือน เช่น PO260116",
    nickname: "ชื่อเล่น",
    nicknameHint: "ใช้แสดงในระบบแทนชื่อจริง",
    taxId: "เลขประจำตัวผู้เสียภาษี",
    taxIdError: "ต้องเป็นตัวเลข 13 หลัก ตอนนี้กรอกมา 9 หลัก",

    email: "อีเมล",
    disabled: "ปิดใช้งาน",
    readonly: "แก้ไขไม่ได้",
    searchComponents: "ค้นหา component…",
    username: "ชื่อผู้ใช้",
    copyLink: "คัดลอกลิงก์",
    promoCode: "ใส่โค้ดส่วนลด",
    applyCode: "ใช้โค้ด",

    qtyLabel: "รับเข้า (ชิ้น)",
    weightLabel: "น้ำหนักรวม",
    tons: "ตัน",
    decrement: "ลดลง",
    increment: "เพิ่มขึ้น",

    note: "บันทึกเพิ่มเติม",
    notePlaceholder: "พิมพ์รายละเอียดที่นี่…",

    province: "จังหวัด",
    pickProvince: "เลือกจังหวัด",
    regionCentral: "ภาคกลาง",
    regionNorth: "ภาคเหนือ",
    bkk: "กรุงเทพมหานคร",
    ayu: "พระนครศรีอยุธยา",
    cnx: "เชียงใหม่",
    cri: "เชียงราย",
    hkt: "ภูเก็ต",
    kkc: "ขอนแก่น",

    deliverTo: "จังหวัดปลายทาง",
    deliverError: "เลือกอย่างน้อย 1 จังหวัด",
    search: "ค้นหา",
    selectAll: "เลือกทั้งหมด",

    category: "หมวดหมู่",
    grpDesign: "ออกแบบ",
    grpDev: "พัฒนา",
    optUi: "UI",
    optUx: "UX",
    optFe: "Frontend",
    optBe: "Backend",
  },
  en: {
    statesHint: "Required · optional · hint · error",
    inputHint: "Basic text field",
    inputGroupHint: "Icon / text / button inside one field",
    numberHint: "− / + buttons · 2 decimal places",
    unitHint: "Unit inside the field, no buttons",
    textareaHint: "Multi-line text",
    selectHint: "shadcn dropdown",
    selectErrorHint: "Error state",
    nativeHint: "Native dropdown — uses the OS picker on mobile",
    multiHint: "Multi-select (ours)",
    multiErrorHint: "Multi-select · error state",

    required: "Required",
    optional: "Optional",

    docNo: "Document number",
    docHint: "PO followed by year and month, e.g. PO260116",
    nickname: "Nickname",
    nicknameHint: "Shown in the app instead of your legal name",
    taxId: "Tax ID",
    taxIdError: "Must be 13 digits — you entered 9",

    email: "Email",
    disabled: "Disabled",
    readonly: "Cannot be edited",
    searchComponents: "Search components…",
    username: "Username",
    copyLink: "Copy link",
    promoCode: "Enter promo code",
    applyCode: "Apply",

    qtyLabel: "Received (pieces)",
    weightLabel: "Total weight",
    tons: "t",
    decrement: "Decrease",
    increment: "Increase",

    note: "Notes",
    notePlaceholder: "Type the details here…",

    province: "Province",
    pickProvince: "Select a province",
    regionCentral: "Central",
    regionNorth: "North",
    bkk: "Bangkok",
    ayu: "Ayutthaya",
    cnx: "Chiang Mai",
    cri: "Chiang Rai",
    hkt: "Phuket",
    kkc: "Khon Kaen",

    deliverTo: "Destination provinces",
    deliverError: "Pick at least one province",
    search: "Search",
    selectAll: "Select all",

    category: "Category",
    grpDesign: "Design",
    grpDev: "Engineering",
    optUi: "UI",
    optUx: "UX",
    optFe: "Frontend",
    optBe: "Backend",
  },
});

/* ป้ายบอกว่าช่องไหนบังคับ ช่องไหนไม่บังคับ

   ต้องเลือกอย่างใดอย่างหนึ่งแล้วใช้ให้เหมือนกันทั้งฟอร์ม — ห้ามผสม
   ถ้าฟอร์มไหนส่วนใหญ่บังคับ ให้ติด (ไม่บังคับ) เฉพาะตัวที่ไม่บังคับ
   ถ้าฟอร์มไหนส่วนใหญ่ไม่บังคับ ให้ติด * เฉพาะตัวที่บังคับ
   ติดทั้งสองแบบพร้อมกันคนอ่านจะไล่ไม่ทันว่าต้องกรอกอะไรบ้าง */

function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-destructive">
      *
    </span>
  );
}

function OptionalMark({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-1 font-normal text-muted-foreground">({children})</span>
  );
}

/** คำใบ้ใต้ช่อง — ใช้คู่กับ aria-describedby เสมอ ไม่งั้น screen reader ไม่อ่าน */
function FieldHint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}

/** ข้อความผิดพลาด — role="alert" ให้ screen reader อ่านทันทีที่โผล่ */
function FieldErrorText({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {children}
    </p>
  );
}

const PROVINCE_KEYS = ["bkk", "cnx", "hkt", "kkc"] as const;

export function SectionFields() {
  const t = useT();
  const c = useCopy(COPY);
  const [dest, setDest] = React.useState<string[]>([]);

  const provinceOptions: MultiSelectOption[] = PROVINCE_KEYS.map((k) => ({
    value: k,
    label: c[k],
  }));

  return (
    <Section
      id="fields"
      title={t("section.fields")}
      hint="input · input-group · number-input · textarea · select · native-select · multi-select"
    >
      {/* ---------- สถานะของช่องกรอก ---------- */}
      <Demo name="สถานะของช่อง" hint={c.statesHint} wide bodyClassName="block">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="f-doc">
              {c.docNo}
              <RequiredMark />
            </Label>
            <Input
              id="f-doc"
              placeholder="PO260116/01-01"
              aria-describedby="f-doc-hint"
              required
            />
            <FieldHint id="f-doc-hint">{c.docHint}</FieldHint>
          </div>

          <div className="space-y-2">
            <Label htmlFor="f-nick">
              {c.nickname}
              <OptionalMark>{c.optional}</OptionalMark>
            </Label>
            <Input
              id="f-nick"
              placeholder="—"
              aria-describedby="f-nick-hint"
            />
            <FieldHint id="f-nick-hint">{c.nicknameHint}</FieldHint>
          </div>

          <div className="space-y-2">
            <Label htmlFor="f-tax">
              {c.taxId}
              <RequiredMark />
            </Label>
            <Input
              id="f-tax"
              defaultValue="123456789"
              aria-invalid
              aria-describedby="f-tax-err"
            />
            <FieldErrorText id="f-tax-err">{c.taxIdError}</FieldErrorText>
          </div>

          <div className="space-y-2">
            <Label htmlFor="f-off">{c.disabled}</Label>
            <Input id="f-off" placeholder={c.readonly} disabled />
          </div>
        </div>
      </Demo>

      {/* ---------- ช่องกรอกพื้นฐาน ---------- */}
      <Demo name="input + label" hint={c.inputHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-email">{c.email}</Label>
          <Input id="f-email" type="email" placeholder="you@example.com" />
        </div>
      </Demo>

      <Demo name="input-group" hint={c.inputGroupHint}>
        <div className="w-full space-y-3">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder={c.searchComponents} />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder={c.username} />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@company.co.th</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          {/* ปุ่มไอคอน: ghost — ไม่มีขอบ จึงไม่ตีเส้นซ้อนกับขอบของ InputGroup */}
          <InputGroup>
            <InputGroupInput
              defaultValue="https://design.company.co.th"
              readOnly
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label={c.copyLink}>
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {/* ปุ่มข้อความ: secondary + ขนาดเริ่มต้น (xs)
              อย่าใส่ size="sm" — มันสูง 32px และใช้ rounded-md เท่ากับกรอบของ
              InputGroup พอดี จะเห็นเป็นมุมโค้งซ้อนกัน */}
          <InputGroup>
            <InputGroupInput placeholder={c.promoCode} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">
                {c.applyCode}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Demo>

      {/* ---------- ตัวเลข ---------- */}
      <Demo name="number-input" hint={c.numberHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-qty">{c.qtyLabel}</Label>
          <NumberInput
            id="f-qty"
            defaultValue={0}
            precision={2}
            step={0.5}
            decrementLabel={c.decrement}
            incrementLabel={c.increment}
          />
        </div>
      </Demo>

      <Demo name="number-input" hint={c.unitHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-weight">{c.weightLabel}</Label>
          <NumberInput
            id="f-weight"
            steppers={false}
            unit={c.tons}
            precision={2}
            placeholder="0.00"
          />
        </div>
      </Demo>

      <Demo name="textarea" hint={c.textareaHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-note">{c.note}</Label>
          <Textarea id="f-note" placeholder={c.notePlaceholder} rows={4} />
        </div>
      </Demo>

      {/* ---------- ช่องเลือก ---------- */}
      <Demo name="select" hint={c.selectHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-province">{c.province}</Label>
          <Select>
            <SelectTrigger id="f-province" className="w-full">
              <SelectValue placeholder={c.pickProvince} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{c.regionCentral}</SelectLabel>
                <SelectItem value="bkk">{c.bkk}</SelectItem>
                <SelectItem value="ayu">{c.ayu}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>{c.regionNorth}</SelectLabel>
                <SelectItem value="cnx">{c.cnx}</SelectItem>
                <SelectItem value="cri">{c.cri}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Demo>

      <Demo name="select" hint={c.selectErrorHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-province-err">
            {c.province}
            <RequiredMark />
          </Label>
          <Select>
            {/* aria-invalid บน trigger — Select ของ shadcn อ่านค่านี้ไปตีกรอบแดงเอง */}
            <SelectTrigger
              id="f-province-err"
              className="w-full"
              aria-invalid
              aria-describedby="f-province-err-msg"
            >
              <SelectValue placeholder={c.pickProvince} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bkk">{c.bkk}</SelectItem>
              <SelectItem value="cnx">{c.cnx}</SelectItem>
            </SelectContent>
          </Select>
          <FieldErrorText id="f-province-err-msg">
            {c.deliverError}
          </FieldErrorText>
        </div>
      </Demo>

      <Demo name="native-select" hint={c.nativeHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-native">{c.category}</Label>
          <NativeSelect id="f-native" defaultValue="ui">
            <NativeSelectOptGroup label={c.grpDesign}>
              <NativeSelectOption value="ui">{c.optUi}</NativeSelectOption>
              <NativeSelectOption value="ux">{c.optUx}</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label={c.grpDev}>
              <NativeSelectOption value="fe">{c.optFe}</NativeSelectOption>
              <NativeSelectOption value="be">{c.optBe}</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>
      </Demo>

      <Demo name="multi-select" hint={c.multiHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-multi">{c.deliverTo}</Label>
          <MultiSelect
            id="f-multi"
            options={provinceOptions}
            value={dest}
            onValueChange={setDest}
            placeholder={c.pickProvince}
            searchPlaceholder={c.search}
            selectAllLabel={c.selectAll}
          />
        </div>
      </Demo>

      <Demo name="multi-select" hint={c.multiErrorHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="f-multi-err">
            {c.deliverTo}
            <RequiredMark />
          </Label>
          <MultiSelect
            id="f-multi-err"
            options={provinceOptions}
            defaultValue={[]}
            placeholder={c.pickProvince}
            className={cn("aria-invalid:border-destructive")}
            aria-invalid
            aria-describedby="f-multi-err-msg"
          />
          <FieldErrorText id="f-multi-err-msg">{c.deliverError}</FieldErrorText>
        </div>
      </Demo>
    </Section>
  );
}
