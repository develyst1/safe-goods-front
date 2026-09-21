import type { FeePayer, PartyRole, PriceMode } from "@/types/api/main/room";

/** /rooms/new form values (Ant Design Form) — mapped to SPEC endpoint 8's body on submit. */
export interface OpenRoomFormValues {
  myRole: PartyRole;
  categoryId: number;
  description: string;
  enteredPrice: number;
  priceMode: PriceMode;
  feePayer: FeePayer;
}
