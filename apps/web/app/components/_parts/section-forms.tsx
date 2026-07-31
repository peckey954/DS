"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CopyIcon,
  ItalicIcon,
  MailIcon,
  SearchIcon,
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
import { Switch } from "@repo/ui/components/ui/switch";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Toggle } from "@repo/ui/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui/components/ui/toggle-group";

import { Demo, Section } from "./showcase";

/** หัวข้อย่อยของแต่ละรูปแบบภายในกล่อง demo เดียวกัน */
function VariantTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

type ProfileValues = { displayName: string };

function FormDemo() {
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
            required: "กรุณากรอกชื่อที่แสดง",
            minLength: { value: 3, message: "ต้องยาวอย่างน้อย 3 ตัวอักษร" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อที่แสดง</FormLabel>
              <FormControl>
                <Input placeholder="เช่น สมชาย ใจดี" {...field} />
              </FormControl>
              <FormDescription>
                ลองกดบันทึกโดยเว้นว่างเพื่อดูข้อความผิดพลาด
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm">
            บันทึก
          </Button>
          {saved ? (
            <p className="text-sm text-muted-foreground">บันทึกแล้ว: {saved}</p>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

export function SectionForms() {
  const [otp, setOtp] = React.useState("");

  return (
    <Section
      id="forms"
      title="ฟอร์ม & อินพุต"
      hint="button · button-group · input · input-group · textarea · label · field · form · checkbox · radio-group · select · native-select · switch · slider · toggle · toggle-group · input-otp"
    >
      <Demo name="button" hint="6 variant × 4 ขนาด" wide>
        <div className="w-full space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button>ปุ่มหลัก</Button>
            <Button variant="secondary">รอง</Button>
            <Button variant="outline">เส้นขอบ</Button>
            <Button variant="ghost">โปร่ง</Button>
            <Button variant="destructive">ลบ</Button>
            <Button variant="link">ลิงก์</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="default">default</Button>
            <Button size="lg">lg</Button>
            <Button size="icon" aria-label="ค้นหา">
              <SearchIcon />
            </Button>
            <Button disabled>ปิดใช้งาน</Button>
          </div>
        </div>
      </Demo>

      <Demo name="button-group" hint="จัดกลุ่มปุ่มให้ติดกัน">
        <div className="w-full space-y-3">
          <ButtonGroup>
            <Button variant="outline">ก่อนหน้า</Button>
            <Button variant="outline">ถัดไป</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <Input placeholder="example.com" className="w-48" />
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">คัดลอก</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">แชร์</Button>
          </ButtonGroup>
        </div>
      </Demo>

      <Demo name="input + label" hint="ช่องกรอกพื้นฐาน">
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label htmlFor="demo-email">อีเมล</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-disabled">ปิดใช้งาน</Label>
            <Input id="demo-disabled" placeholder="แก้ไขไม่ได้" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-invalid">สถานะไม่ถูกต้อง</Label>
            <Input id="demo-invalid" aria-invalid defaultValue="ค่าไม่ถูกต้อง" />
          </div>
        </div>
      </Demo>

      <Demo name="input-group" hint="ไอคอน / ข้อความ / ปุ่ม ในช่องเดียวกัน">
        <div className="w-full space-y-3">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="ค้นหา component…" />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="ชื่อผู้ใช้" />
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
              <InputGroupButton size="icon-xs" aria-label="คัดลอกลิงก์">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {/* ปุ่มข้อความ: secondary — พื้นทึบ ไม่ใช้ outline ที่มีขอบ */}
          <InputGroup>
            <InputGroupInput placeholder="ใส่โค้ดส่วนลด" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary" size="sm">
                ใช้โค้ด
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Demo>

      <Demo name="textarea" hint="ข้อความหลายบรรทัด">
        <div className="w-full space-y-2">
          <Label htmlFor="demo-note">บันทึกเพิ่มเติม</Label>
          <Textarea
            id="demo-note"
            placeholder="พิมพ์รายละเอียดที่นี่…"
            rows={4}
          />
        </div>
      </Demo>

      <Demo name="checkbox" hint="พื้นฐาน · มีคำอธิบาย · แบบกล่อง · ปิดใช้งาน" wide>
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <VariantTitle>พื้นฐาน</VariantTitle>
            {["รับข่าวสารทางอีเมล", "แจ้งเตือนบนมือถือ", "สรุปรายสัปดาห์"].map(
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
            <VariantTitle>มีคำอธิบายใต้หัวข้อ</VariantTitle>
            <Field orientation="horizontal">
              <Checkbox id="cb-desc" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="cb-desc">เก็บฉันไว้ในระบบ</FieldLabel>
                <FieldDescription>
                  ไม่ต้องเข้าสู่ระบบใหม่บนอุปกรณ์นี้เป็นเวลา 30 วัน
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>

          <div className="space-y-3">
            <VariantTitle>แบบกล่อง — ค่าเริ่มต้น: ปุ่มอยู่ซ้าย</VariantTitle>
            <FieldGroup className="gap-3">
              {[
                {
                  id: "cb-box-1",
                  title: "แผนมาตรฐาน",
                  desc: "ผู้ใช้ 5 คน · พื้นที่ 20 GB",
                  checked: true,
                },
                {
                  id: "cb-box-2",
                  title: "แผนองค์กร",
                  desc: "ผู้ใช้ไม่จำกัด · พื้นที่ 1 TB",
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
            <VariantTitle>ปิดใช้งาน (กดไม่ได้)</VariantTitle>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-1" disabled />
              <Label htmlFor="cb-off-1" className="font-normal text-muted-foreground">
                ยังไม่ได้เลือก
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-2" disabled defaultChecked />
              <Label htmlFor="cb-off-2" className="font-normal text-muted-foreground">
                เลือกไว้แล้ว
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-off-3" disabled checked="indeterminate" />
              <Label htmlFor="cb-off-3" className="font-normal text-muted-foreground">
                เลือกบางส่วน
              </Label>
            </div>
            <FieldLabel htmlFor="cb-box-off">
              <Field orientation="horizontal">
                <Checkbox id="cb-box-off" disabled defaultChecked />
                <FieldContent>
                  <FieldTitle>แผนที่ปิดขายแล้ว</FieldTitle>
                  <FieldDescription>ไม่เปิดให้สมัครใหม่</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          </div>
        </div>
      </Demo>

      <Demo name="radio-group" hint="พื้นฐาน · มีคำอธิบาย · แบบกล่อง · ปิดใช้งาน" wide>
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <VariantTitle>พื้นฐาน</VariantTitle>
            <RadioGroup defaultValue="standard">
              {[
                { value: "standard", label: "จัดส่งมาตรฐาน (3–5 วัน)" },
                { value: "express", label: "จัดส่งด่วน (1–2 วัน)" },
                { value: "pickup", label: "รับเองที่สาขา" },
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
            <VariantTitle>มีคำอธิบายใต้หัวข้อ</VariantTitle>
            <RadioGroup defaultValue="monthly">
              {[
                {
                  value: "monthly",
                  title: "รายเดือน",
                  desc: "฿390 / เดือน ยกเลิกได้ทุกเมื่อ",
                },
                {
                  value: "yearly",
                  title: "รายปี",
                  desc: "฿3,900 / ปี ประหยัดกว่า 2 เดือน",
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
            <VariantTitle>แบบกล่อง — ค่าเริ่มต้น: ปุ่มอยู่ซ้าย</VariantTitle>
            <RadioGroup defaultValue="card" className="gap-3">
              {[
                {
                  value: "card",
                  title: "บัตรเครดิต / เดบิต",
                  desc: "ตัดเงินทันที รองรับทุกธนาคาร",
                },
                {
                  value: "promptpay",
                  title: "พร้อมเพย์",
                  desc: "สแกน QR ผ่านแอปธนาคาร",
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
            <VariantTitle>ปิดใช้งาน (กดไม่ได้)</VariantTitle>
            <RadioGroup defaultValue="off-selected">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="off-selected" id="rg-off-1" disabled />
                <Label htmlFor="rg-off-1" className="font-normal text-muted-foreground">
                  เลือกไว้แล้ว
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="off-empty" id="rg-off-2" disabled />
                <Label htmlFor="rg-off-2" className="font-normal text-muted-foreground">
                  ยังไม่ได้เลือก
                </Label>
              </div>
            </RadioGroup>
            <RadioGroup defaultValue="sold-out" disabled className="gap-3">
              <FieldLabel htmlFor="rg-box-off">
                <Field orientation="horizontal">
                  <RadioGroupItem value="sold-out" id="rg-box-off" />
                  <FieldContent>
                    <FieldTitle>รอบที่เต็มแล้ว</FieldTitle>
                    <FieldDescription>ปิดรับสมัครรอบนี้</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>
        </div>
      </Demo>

      <Demo name="select" hint="ดรอปดาวน์แบบ custom">
        <div className="w-full space-y-2">
          <Label htmlFor="demo-province">จังหวัด</Label>
          <Select>
            <SelectTrigger id="demo-province" className="w-full">
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>ภาคกลาง</SelectLabel>
                <SelectItem value="bkk">กรุงเทพมหานคร</SelectItem>
                <SelectItem value="ayu">พระนครศรีอยุธยา</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>ภาคเหนือ</SelectLabel>
                <SelectItem value="cnx">เชียงใหม่</SelectItem>
                <SelectItem value="cri">เชียงราย</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Demo>

      <Demo name="native-select" hint="ใช้ <select> ของเบราว์เซอร์">
        <div className="w-full space-y-2">
          <Label htmlFor="demo-native">หมวดหมู่</Label>
          <NativeSelect id="demo-native" defaultValue="ui">
            <NativeSelectOptGroup label="ดีไซน์">
              <NativeSelectOption value="ui">ส่วนติดต่อผู้ใช้</NativeSelectOption>
              <NativeSelectOption value="ux">ประสบการณ์ผู้ใช้</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="พัฒนา">
              <NativeSelectOption value="fe">ฟรอนต์เอนด์</NativeSelectOption>
              <NativeSelectOption value="be">แบ็กเอนด์</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>
      </Demo>

      <Demo name="switch" hint="เปิด / ปิด">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-1">โหมดประหยัดข้อมูล</Label>
            <Switch id="sw-1" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-2">ซิงก์อัตโนมัติ</Label>
            <Switch id="sw-2" />
          </div>
          <div className="flex items-center justify-between opacity-50">
            <Label htmlFor="sw-3">ฟีเจอร์ทดลอง</Label>
            <Switch id="sw-3" disabled />
          </div>
        </div>
      </Demo>

      <Demo name="slider" hint="ค่าเดี่ยว / ช่วงค่า">
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <Label>ระดับเสียง</Label>
            <Slider defaultValue={[60]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>ช่วงราคา</Label>
            <Slider defaultValue={[20, 80]} max={100} step={5} />
          </div>
        </div>
      </Demo>

      <Demo name="toggle + toggle-group" hint="ปุ่มสลับสถานะ">
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <Toggle aria-label="ตัวหนา">
              <BoldIcon />
            </Toggle>
            <Toggle aria-label="ตัวเอียง" variant="outline">
              <ItalicIcon />
            </Toggle>
            <Toggle aria-label="ขีดเส้นใต้" variant="outline" size="lg">
              <UnderlineIcon />
            </Toggle>
          </div>
          <ToggleGroup type="single" defaultValue="left" variant="outline">
            <ToggleGroupItem value="left" aria-label="ชิดซ้าย">
              <AlignLeftIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="กึ่งกลาง">
              <AlignCenterIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="ชิดขวา">
              <AlignRightIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Demo>

      <Demo name="input-otp" hint="กรอกรหัส 6 หลัก">
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
            {otp ? `กรอกแล้ว: ${otp}` : "ยังไม่ได้กรอก"}
          </p>
        </div>
      </Demo>

      <Demo name="field" hint="โครงฟอร์มพร้อมคำอธิบาย" wide>
        <FieldSet className="w-full">
          <FieldLegend>ตั้งค่าบัญชี</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>โปรไฟล์สาธารณะ</FieldTitle>
                <FieldDescription>
                  ให้คนอื่นค้นหาโปรไฟล์ของคุณเจอจากหน้าค้นหา
                </FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="field-bio">แนะนำตัว</FieldLabel>
              <Textarea id="field-bio" placeholder="เล่าเรื่องของคุณสั้น ๆ" />
              <FieldDescription>ไม่เกิน 160 ตัวอักษร</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Demo>

      <Demo name="form" hint="react-hook-form + validation" wide>
        <FormDemo />
      </Demo>
    </Section>
  );
}
