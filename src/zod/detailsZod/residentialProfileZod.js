import { z } from "zod";

export const residentialProfileSchema = z.object({
  /* ===== AMENITIES ===== */
  amenities: z
    .array(
      z.union([
        z.string(),
        z.object({
          title: z.string().min(1),
        }),
      ]),
    )
    .transform((arr) => arr.map((a) => (typeof a === "string" ? a : a.title)))
    .optional(),

  /* ===== PARKING ===== */
  parkingType: z.enum(["open", "closed", "both"]).optional(),

  parkingDetails: z
    .object({
      twoWheeler: z.preprocess(
        (val) => (val === "" || val === undefined ? 0 : Number(val)),
        z.number().min(0, "Cannot be negative"),
      ),
      fourWheeler: z.preprocess(
        (val) => (val === "" || val === undefined ? 0 : Number(val)),
        z.number().min(0, "Cannot be negative"),
      ),
    })
    .optional(),

  /* ===== FLOORING ===== */
  flooringType: z
    .enum([
      "vitrified",
      "marble",
      "granite",
      "wooden",
      "ceramic-tiles",
      "mosaic",
      "normal-tiles",
      "cement",
      "other",
    ])
    .optional(),

  /* ===== FLOORS ===== */
  floorNumber: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0, "Floor number cannot be negative").optional(),
  ),

  totalFloors: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0, "Total floors cannot be negative").optional(),
  ),

  /* ===== KITCHEN ===== */
  kitchenType: z
    .enum([
      "open",
      "closed",
      "semi-open",
      "island",
      "parallel",
      "u-shaped",
      "l-shaped",
    ])
    .optional(),

  isModularKitchen: z.boolean().optional(),

  /* ===== PRICING ===== */
  isPriceNegotiable: z.boolean().optional(),

  /* ===== LISTING ===== */
  listingType: z.enum(["sale", "rent"]).optional(),

  /* ===== DESCRIPTION ===== */
  description: z.preprocess(
    (val) => val ?? "",
    z.string().min(30, "Description must be at least 30 characters long"),
  ),

  /* ===== IMAGES (React Native format) ===== */
  images: z
    .array(
      z
        .object({
          uri: z.string().optional(),
          url: z.string().optional(),
          name: z.string().optional(),
          type: z.string().optional(),
        })
        .refine((data) => data.uri || data.url, {
          message: "Image must have uri or url",
        }),
    )
    .min(5, "Upload at least 5 images"),
});

export const validateResidentialProfile = (residential, images) => {
  console.log(images, "zod");
  return residentialProfileSchema.safeParse({
    ...residential,
    images,
  });
};
