"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowRightIcon,
  BoldIcon,
  CopyIcon,
  DownloadIcon,
  ItalicIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  UnderlineIcon,
} from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@repo/ui/components/ui/button-group";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@repo/ui/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@repo/ui/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@repo/ui/components/ui/input-otp";
import { Label } from "@repo/ui/components/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@repo/ui/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Slider } from "@repo/ui/components/ui/slider";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { Switch } from "@repo/ui/components/ui/switch";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Toggle } from "@repo/ui/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/ui/toggle-group";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    buttonHint: "variant · ขนาด · มีไอคอน · กำลังโหลด",
    vVariant: "variant",
    vSize: "ขนาด",
    vIcon: "มีไอคอน — ซ้าย / ขวา / ไอคอนล้วน",
    vLoading: "กำลังโหลด (spinner)",
    btnPrimary: "ปุ่มหลัก",
    btnSecondary: "รอง",
    btnOutline: "เส้นขอบ",
    btnGhost: "โปร่ง",
    btnDestructive: "ลบ",
    btnLink: "ลิงก์",
    disabled: "ปิดใช้งาน",
    addItem: "เพิ่มรายการ",
    next: "ถัดไป",
    download: "ดาวน์โหลด",
    deleteIt: "ลบทิ้ง",
    search: "ค้นหา",
    settings: "ตั้งค่า",
    iconNote: "วางไอคอนเป็นลูกของ Button ได้เลย — ขนาดและระยะห่างถูกจัดให้อัตโนมัติ ไอคอนล้วนต้องมี aria-label เสมอ",
    tryMe: "กดเพื่อลองดู",
    saving: "กำลังบันทึก…",
    pleaseWait: "กรุณารอสักครู่",
    loading: "กำลังโหลด",
    loadingNote: "ปุ่มซ้ายสุดกดได้จริง — ระหว่างโหลดให้ใส่ disabled ด้วยเพื่อกันกดซ้ำ",
    groupHint: "จัดกลุ่มปุ่มให้ติดกัน",
    prev: "ก่อนหน้า",
    copy: "คัดลอก",
    share: "แชร์",
    inputHint: "ช่องกรอกพื้นฐาน",
    email: "อีเมล",
    readonly: "แก้ไขไม่ได้",
    invalidState: "สถานะไม่ถูกต้อง",
    invalidValue: "ค่าไม่ถูกต้อง",
    inputGroupHint: "ไอคอน / ข้อความ / ปุ่ม ในช่องเดียวกัน",
    searchComponents: "ค้นหา component…",
    username: "ชื่อผู้ใช้",
    copyLink: "คัดลอกลิงก์",
    promoCode: "ใส่โค้ดส่วนลด",
    applyCode: "ใช้โค้ด",
    textareaHint: "ข้อความหลายบรรทัด",
    note: "บันทึกเพิ่มเติม",
    notePlaceholder: "พิมพ์รายละเอียดที่นี่…",
    checkboxHint: "พื้นฐาน · มีคำอธิบาย · แบบกล่อง · ปิดใช้งาน",
    basic: "พื้นฐาน",
    withDesc: "มีคำอธิบายใต้หัวข้อ",
    boxDefault: "แบบกล่อง — ค่าเริ่มต้น: ปุ่มอยู่ซ้าย",
    disabledNoClick: "ปิดใช้งาน (กดไม่ได้)",
    cbNews: "รับข่าวสารทางอีเมล",
    cbMobile: "แจ้งเตือนบนมือถือ",
    cbWeekly: "สรุปรายสัปดาห์",
    keepMe: "เก็บฉันไว้ในระบบ",
    keepMeDesc: "ไม่ต้องเข้าสู่ระบบใหม่บนอุปกรณ์นี้เป็นเวลา 30 วัน",
    planStd: "แผนมาตรฐาน",
    planStdDesc: "ผู้ใช้ 5 คน · พื้นที่ 20 GB",
    planEnt: "แผนองค์กร",
    planEntDesc: "ผู้ใช้ไม่จำกัด · พื้นที่ 1 TB",
    notChecked: "ยังไม่ได้เลือก",
    alreadyChecked: "เลือกไว้แล้ว",
    partial: "เลือกบางส่วน",
    planClosed: "แผนที่ปิดขายแล้ว",
    planClosedDesc: "ไม่เปิดให้สมัครใหม่",
    shipStandard: "จัดส่งมาตรฐาน (3–5 วัน)",
    shipExpress: "จัดส่งด่วน (1–2 วัน)",
    shipPickup: "รับเองที่สาขา",
    monthly: "รายเดือน",
    monthlyDesc: "฿390 / เดือน ยกเลิกได้ทุกเมื่อ",
    yearly: "รายปี",
    yearlyDesc: "฿3,900 / ปี ประหยัดกว่า 2 เดือน",
    payCard: "บัตรเครดิต / เดบิต",
    payCardDesc: "ตัดเงินทันที รองรับทุกธนาคาร",
    payQr: "พร้อมเพย์",
    payQrDesc: "สแกน QR ผ่านแอปธนาคาร",
    roundFull: "รอบที่เต็มแล้ว",
    roundFullDesc: "ปิดรับสมัครรอบนี้",
    selectHint: "ดรอปดาวน์แบบ custom",
    province: "จังหวัด",
    pickProvince: "เลือกจังหวัด",
    regionCentral: "ภาคกลาง",
    regionNorth: "ภาคเหนือ",
    bkk: "กรุงเทพมหานคร",
    ayu: "พระนครศรีอยุธยา",
    cnx: "เชียงใหม่",
    cri: "เชียงราย",
    nativeHint: "ใช้ <select> ของเบราว์เซอร์",
    category: "หมวดหมู่",
    grpDesign: "ดีไซน์",
    optUi: "ส่วนติดต่อผู้ใช้",
    optUx: "ประสบการณ์ผู้ใช้",
    grpDev: "พัฒนา",
    optFe: "ฟรอนต์เอนด์",
    optBe: "แบ็กเอนด์",
    switchHint: "เปิด / ปิด",
    dataSaver: "โหมดประหยัดข้อมูล",
    autoSync: "ซิงก์อัตโนมัติ",
    betaFeature: "ฟีเจอร์ทดลอง",
    sliderHint: "ค่าเดี่ยว / ช่วงค่า",
    volume: "ระดับเสียง",
    priceRange: "ช่วงราคา",
    toggleHint: "ปุ่มสลับสถานะ",
    bold: "ตัวหนา",
    italic: "ตัวเอียง",
    underline: "ขีดเส้นใต้",
    alignLeft: "ชิดซ้าย",
    alignCenter: "กึ่งกลาง",
    alignRight: "ชิดขวา",
    otpHint: "กรอกรหัส 6 หลัก",
    otpFilled: "กรอกแล้ว:",
    otpEmpty: "ยังไม่ได้กรอก",
    fieldHint: "โครงฟอร์มพร้อมคำอธิบาย",
    accountSettings: "ตั้งค่าบัญชี",
    publicProfile: "โปรไฟล์สาธารณะ",
    publicProfileDesc: "ให้คนอื่นค้นหาโปรไฟล์ของคุณเจอจากหน้าค้นหา",
    bio: "แนะนำตัว",
    bioPlaceholder: "เล่าเรื่องของคุณสั้น ๆ",
    bioDesc: "ไม่เกิน 160 ตัวอักษร",
    formHint: "react-hook-form + validation",
    displayName: "ชื่อที่แสดง",
    namePlaceholder: "เช่น สมชาย ใจดี",
    nameDesc: "ลองกดบันทึกโดยเว้นว่างเพื่อดูข้อความผิดพลาด",
    required: "กรุณากรอกชื่อที่แสดง",
    minLen: "ต้องยาวอย่างน้อย 3 ตัวอักษร",
    save: "บันทึก",
    saved: "บันทึกแล้ว:",
  },
  en: {
    buttonHint: "variant · size · with icon · loading",
    vVariant: "variant",
    vSize: "size",
    vIcon: "With icon — left / right / icon only",
    vLoading: "Loading (spinner)",
    btnPrimary: "Primary",
    btnSecondary: "Secondary",
    btnOutline: "Outline",
    btnGhost: "Ghost",
    btnDestructive: "Delete",
    btnLink: "Link",
    disabled: "Disabled",
    addItem: "Add item",
    next: "Next",
    download: "Download",
    deleteIt: "Delete",
    search: "Search",
    settings: "Settings",
    iconNote: "Drop the icon straight inside Button — size and spacing are handled for you. Icon-only buttons always need an aria-label.",
    tryMe: "Click to try",
    saving: "Saving…",
    pleaseWait: "Please wait",
    loading: "Loading",
    loadingNote: "The leftmost button really works — add disabled while loading so it cannot be clicked twice",
    groupHint: "Group buttons together",
    prev: "Previous",
    copy: "Copy",
    share: "Share",
    inputHint: "Basic text field",
    email: "Email",
    readonly: "Cannot be edited",
    invalidState: "Invalid state",
    invalidValue: "Invalid value",
    inputGroupHint: "Icon / text / button inside one field",
    searchComponents: "Search components…",
    username: "Username",
    copyLink: "Copy link",
    promoCode: "Enter a promo code",
    applyCode: "Apply",
    textareaHint: "Multi-line text",
    note: "Additional notes",
    notePlaceholder: "Type the details here…",
    checkboxHint: "Basic · with description · boxed · disabled",
    basic: "Basic",
    withDesc: "With a description",
    boxDefault: "Boxed — default: control on the left",
    disabledNoClick: "Disabled (cannot be clicked)",
    cbNews: "Email newsletter",
    cbMobile: "Mobile notifications",
    cbWeekly: "Weekly digest",
    keepMe: "Keep me signed in",
    keepMeDesc: "Stay signed in on this device for 30 days",
    planStd: "Standard plan",
    planStdDesc: "5 users · 20 GB storage",
    planEnt: "Enterprise plan",
    planEntDesc: "Unlimited users · 1 TB storage",
    notChecked: "Not selected",
    alreadyChecked: "Already selected",
    partial: "Partially selected",
    planClosed: "Discontinued plan",
    planClosedDesc: "No longer open for sign-ups",
    shipStandard: "Standard delivery (3–5 days)",
    shipExpress: "Express delivery (1–2 days)",
    shipPickup: "Collect in store",
    monthly: "Monthly",
    monthlyDesc: "฿390 / month, cancel any time",
    yearly: "Yearly",
    yearlyDesc: "฿3,900 / year, 2 months cheaper",
    payCard: "Credit / debit card",
    payCardDesc: "Charged instantly, all banks supported",
    payQr: "PromptPay",
    payQrDesc: "Scan the QR code in your banking app",
    roundFull: "This round is full",
    roundFullDesc: "Sign-ups are closed",
    selectHint: "Custom dropdown",
    province: "Province",
    pickProvince: "Select a province",
    regionCentral: "Central",
    regionNorth: "Northern",
    bkk: "Bangkok",
    ayu: "Ayutthaya",
    cnx: "Chiang Mai",
    cri: "Chiang Rai",
    nativeHint: "Uses the browser's own <select>",
    category: "Category",
    grpDesign: "Design",
    optUi: "User interface",
    optUx: "User experience",
    grpDev: "Engineering",
    optFe: "Frontend",
    optBe: "Backend",
    switchHint: "On / off",
    dataSaver: "Data saver mode",
    autoSync: "Automatic sync",
    betaFeature: "Experimental features",
    sliderHint: "Single value / range",
    volume: "Volume",
    priceRange: "Price range",
    toggleHint: "Toggle buttons",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    alignLeft: "Align left",
    alignCenter: "Align centre",
    alignRight: "Align right",
    otpHint: "Enter the 6-digit code",
    otpFilled: "Entered:",
    otpEmpty: "Nothing entered yet",
    fieldHint: "Form scaffold with descriptions",
    accountSettings: "Account settings",
    publicProfile: "Public profile",
    publicProfileDesc: "Let other people find your profile from search",
    bio: "About you",
    bioPlaceholder: "Tell your story briefly",
    bioDesc: "160 characters max",
    formHint: "react-hook-form + validation",
    displayName: "Display name",
    namePlaceholder: "e.g. Somchai Jaidee",
    nameDesc: "Try saving with it empty to see the error message",
    required: "Please enter a display name",
    minLen: "Must be at least 3 characters",
    save: "Save",
    saved: "Saved:",
  },
});

/** หัวข้อย่อยของแต่ละรูปแบบภายในกล่อง demo เดียวกัน */
function VariantTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

/** ปุ่มที่กดแล้วเข้าสถานะกำลังโหลดจริง 2 วินาที */
function LoadingButton() {
  const c = useCopy(COPY);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Button disabled={loading} onClick={() => setLoading(true)}>
      {loading ? (
        <>
          <Spinner />
          {c.saving}
        </>
      ) : (
        <>
          <PlusIcon />
          {c.tryMe}
        </>
      )}
    </Button>
  );
}

type ProfileValues = { displayName: string };

function FormDemo() {
  const c = useCopy(COPY);
  const form = useForm<ProfileValues>({
    defaultValues: { displayName: "" },
    mode: "onSubmit",
  });
  const [saved, setSaved] = React.useState<string | null>(null);

  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={form.handleSubmit((values) => setSaved(values.displayName))}
      >
        <FormField
          control={form.control}
          name="displayName"
          rules={{
            required: c.required,
            minLength: { value: 3, message: c.minLen },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{c.displayName}</FormLabel>
              <FormControl>
                <Input placeholder={c.namePlaceholder} {...field} />
              </FormControl>
              <FormDescription>
                {c.nameDesc}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm">
            {c.save}
          </Button>
          {saved ? (
            <p className="text-sm text-muted-foreground">{c.saved} {saved}</p>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

export function SectionForms() {
  const t = useT();
  const c = useCopy(COPY);
  const [otp, setOtp] = React.useState("");

  return (
    <Section
      id="forms"
      title={t("section.forms")}
      hint="button · button-group · input · input-group · textarea · label · field · form · checkbox · radio-group · select · native-select · switch · slider · toggle · toggle-group · input-otp"
    >
      <Demo name="button" hint={c.buttonHint} wide>
        <div className="w-full space-y-5">
          <div className="space-y-3">
            <VariantTitle>{c.vVariant}</VariantTitle>
            <div className="flex flex-wrap gap-2">
              <Button>{c.btnPrimary}</Button>
              <Button variant="secondary">{c.btnSecondary}</Button>
              <Button variant="outline">{c.btnOutline}</Button>
              <Button variant="ghost">{c.btnGhost}</Button>
              <Button variant="destructive">{c.btnDestructive}</Button>
              <Button variant="link">{c.btnLink}</Button>
            </div>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.vSize}</VariantTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">xs</Button>
              <Button size="sm">sm</Button>
              <Button size="default">default</Button>
              <Button size="lg">lg</Button>
              <Button disabled>{c.disabled}</Button>
            </div>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.vIcon}</VariantTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button>
                <PlusIcon />
                {c.addItem}
              </Button>
              <Button variant="secondary">
                {c.next}
                <ArrowRightIcon />
              </Button>
              <Button variant="outline">
                <DownloadIcon />
                {c.download}
              </Button>
              <Button variant="destructive">
                <Trash2Icon />
                {c.deleteIt}
              </Button>
              <Button size="icon" aria-label={c.search}>
                <SearchIcon />
              </Button>
              <Button variant="outline" size="icon-sm" aria-label={c.settings}>
                <SettingsIcon />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {c.iconNote}
            </p>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.vLoading}</VariantTitle>
            <div className="flex flex-wrap items-center gap-2">
              <LoadingButton />
              <Button disabled>
                <Spinner />
                {c.saving}
              </Button>
              <Button variant="secondary" disabled>
                <Spinner />
                {c.pleaseWait}
              </Button>
              <Button variant="outline" size="icon" disabled aria-label={c.loading}>
                <Spinner />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {c.loadingNote}
            </p>
          </div>
        </div>
      </Demo>

      <Demo name="button-group" hint={c.groupHint}>
        <div className="w-full space-y-3">
          <ButtonGroup>
            <Button variant="outline">{c.prev}</Button>
            <Button variant="outline">{c.next}</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Input placeholder="example.com" className="w-48" />
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">{c.copy}</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">{c.share}</Button>
          </ButtonGroup>
        </div>
      </Demo>

      <Demo name="input + label" hint={c.inputHint}>
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label htmlFor="demo-email">{c.email}</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-disabled">{c.disabled}</Label>
            <Input id="demo-disabled" placeholder={c.readonly} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-invalid">{c.invalidState}</Label>
            <Input id="demo-invalid" aria-invalid defaultValue={c.invalidValue} />
          </div>
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
              <InputGroupButton variant="secondary">{c.applyCode}</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Demo>

      <Demo name="textarea" hint={c.textareaHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="demo-note">{c.note}</Label>
          <Textarea
            id="demo-note"
            placeholder={c.notePlaceholder}
            rows={4}
          />
        </div>
      </Demo>

      <Demo name="checkbox" hint={c.checkboxHint} wide>
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <VariantTitle>{c.basic}</VariantTitle>
            {[c.cbNews, c.cbMobile, c.cbWeekly].map(
              (label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <Checkbox id={`cb-${i}`} defaultChecked={i === 0} />
                  <Label htmlFor={`cb-${i}`} className="font-normal">
                    {label}
                  </Label>
                </div>
              )
            )}
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.withDesc}</VariantTitle>
            <Field orientation="horizontal">
              <Checkbox id="cb-desc" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="cb-desc">{c.keepMe}</FieldLabel>
                <FieldDescription>
                  {c.keepMeDesc}
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.boxDefault}</VariantTitle>
            <FieldGroup className="gap-3">
              {[
                {
                  id: "cb-box-1",
                  title: c.planStd,
                  desc: c.planStdDesc,
                  checked: true,
                },
                {
                  id: "cb-box-2",
                  title: c.planEnt,
                  desc: c.planEntDesc,
                  checked: false,
                },
              ].map((o) => (
                <FieldLabel key={o.id} htmlFor={o.id}>
                  <Field orientation="horizontal">
                    <Checkbox id={o.id} defaultChecked={o.checked} />
                    <FieldContent>
                      <FieldTitle>{o.title}</FieldTitle>
                      <FieldDescription>{o.desc}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </FieldGroup>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.disabledNoClick}</VariantTitle>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-1" disabled />
              <Label htmlFor="cb-off-1" className="font-normal text-muted-foreground">
                {c.notChecked}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-2" disabled defaultChecked />
              <Label htmlFor="cb-off-2" className="font-normal text-muted-foreground">
                {c.alreadyChecked}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-3" disabled checked="indeterminate" />
              <Label htmlFor="cb-off-3" className="font-normal text-muted-foreground">
                {c.partial}
              </Label>
            </div>
            <FieldLabel htmlFor="cb-box-off">
              <Field orientation="horizontal">
                <Checkbox id="cb-box-off" disabled defaultChecked />
                <FieldContent>
                  <FieldTitle>{c.planClosed}</FieldTitle>
                  <FieldDescription>{c.planClosedDesc}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          </div>
        </div>
      </Demo>

      <Demo name="radio-group" hint={c.checkboxHint} wide>
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <VariantTitle>{c.basic}</VariantTitle>
            <RadioGroup defaultValue="standard">
              {[
                { value: "standard", label: c.shipStandard },
                { value: "express", label: c.shipExpress },
                { value: "pickup", label: c.shipPickup },
              ].map((o) => (
                <div key={o.value} className="flex items-center gap-2">
                  <RadioGroupItem value={o.value} id={`rg-${o.value}`} />
                  <Label htmlFor={`rg-${o.value}`} className="font-normal">
                    {o.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.withDesc}</VariantTitle>
            <RadioGroup defaultValue="monthly">
              {[
                {
                  value: "monthly",
                  title: c.monthly,
                  desc: c.monthlyDesc,
                },
                {
                  value: "yearly",
                  title: c.yearly,
                  desc: c.yearlyDesc,
                },
              ].map((o) => (
                <Field key={o.value} orientation="horizontal">
                  <RadioGroupItem value={o.value} id={`rgd-${o.value}`} />
                  <FieldContent>
                    <FieldLabel htmlFor={`rgd-${o.value}`}>{o.title}</FieldLabel>
                    <FieldDescription>{o.desc}</FieldDescription>
                  </FieldContent>
                </Field>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.boxDefault}</VariantTitle>
            <RadioGroup defaultValue="card" className="gap-3">
              {[
                {
                  value: "card",
                  title: c.payCard,
                  desc: c.payCardDesc,
                },
                {
                  value: "promptpay",
                  title: c.payQr,
                  desc: c.payQrDesc,
                },
              ].map((o) => (
                <FieldLabel key={o.value} htmlFor={`rgb-${o.value}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={o.value} id={`rgb-${o.value}`} />
                    <FieldContent>
                      <FieldTitle>{o.title}</FieldTitle>
                      <FieldDescription>{o.desc}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <VariantTitle>{c.disabledNoClick}</VariantTitle>
            <RadioGroup defaultValue="off-selected">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="off-selected" id="rg-off-1" disabled />
                <Label htmlFor="rg-off-1" className="font-normal text-muted-foreground">
                  {c.alreadyChecked}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="off-empty" id="rg-off-2" disabled />
                <Label htmlFor="rg-off-2" className="font-normal text-muted-foreground">
                  {c.notChecked}
                </Label>
              </div>
            </RadioGroup>
            <RadioGroup defaultValue="sold-out" disabled className="gap-3">
              <FieldLabel htmlFor="rg-box-off">
                <Field orientation="horizontal">
                  <RadioGroupItem value="sold-out" id="rg-box-off" />
                  <FieldContent>
                    <FieldTitle>{c.roundFull}</FieldTitle>
                    <FieldDescription>{c.roundFullDesc}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>
        </div>
      </Demo>

      <Demo name="select" hint={c.selectHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="demo-province">{c.province}</Label>
          <Select>
            <SelectTrigger id="demo-province" className="w-full">
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

      <Demo name="native-select" hint={c.nativeHint}>
        <div className="w-full space-y-2">
          <Label htmlFor="demo-native">{c.category}</Label>
          <NativeSelect id="demo-native" defaultValue="ui">
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

      <Demo name="switch" hint={c.switchHint}>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-1">{c.dataSaver}</Label>
            <Switch id="sw-1" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-2">{c.autoSync}</Label>
            <Switch id="sw-2" />
          </div>
          <div className="flex items-center justify-between opacity-50">
            <Label htmlFor="sw-3">{c.betaFeature}</Label>
            <Switch id="sw-3" disabled />
          </div>
        </div>
      </Demo>

      <Demo name="slider" hint={c.sliderHint}>
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <Label>{c.volume}</Label>
            <Slider defaultValue={[60]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>{c.priceRange}</Label>
            <Slider defaultValue={[20, 80]} max={100} step={5} />
          </div>
        </div>
      </Demo>

      <Demo name="toggle + toggle-group" hint={c.toggleHint}>
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <Toggle aria-label={c.bold}>
              <BoldIcon />
            </Toggle>
            <Toggle aria-label={c.italic} variant="outline">
              <ItalicIcon />
            </Toggle>
            <Toggle aria-label={c.underline} variant="outline" size="lg">
              <UnderlineIcon />
            </Toggle>
          </div>
          <ToggleGroup type="single" defaultValue="left" variant="outline">
            <ToggleGroupItem value="left" aria-label={c.alignLeft}>
              <AlignLeftIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label={c.alignCenter}>
              <AlignCenterIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label={c.alignRight}>
              <AlignRightIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Demo>

      <Demo name="input-otp" hint={c.otpHint}>
        <div className="w-full space-y-3">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            {otp ? `${c.otpFilled} ${otp}` : c.otpEmpty}
          </p>
        </div>
      </Demo>

      <Demo name="field" hint={c.fieldHint} wide>
        <FieldSet className="w-full">
          <FieldLegend>{c.accountSettings}</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{c.publicProfile}</FieldTitle>
                <FieldDescription>
                  {c.publicProfileDesc}
                </FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="field-bio">{c.bio}</FieldLabel>
              <Textarea id="field-bio" placeholder={c.bioPlaceholder} />
              <FieldDescription>{c.bioDesc}</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Demo>

      <Demo name="form" hint={c.formHint} wide>
        <FormDemo />
      </Demo>
    </Section>
  );
}
