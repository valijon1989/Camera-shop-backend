import { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import ListingService from "../models/Listing.service";
import { ListingInput, ListingInquiry } from "../libs/types/listing";
import { ExtendedRequest } from "../libs/types/member";

const listingService = new ListingService();
const listingController: T = {};

listingController.createListing = async (req: ExtendedRequest, res: Response) => {
  try {
    const input = req.body as ListingInput;
    const result = await listingService.createListing(req.member, input);
    res.status(HttpCode.CREATED).json({ data: result });
  } catch (err) {
    console.log("Error, createListing:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

listingController.getListings = async (req: Request, res: Response) => {
  try {
    const inquiry = req.query as any as ListingInquiry;
    const result = await listingService.getListings(inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getListings:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

listingController.getListingDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await listingService.getListingById(id);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, getListingDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

listingController.getMyListings = async (req: ExtendedRequest, res: Response) => {
  try {
    const result = await listingService.getMyListings(req.member);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, getMyListings:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

listingController.deleteListing = async (req: ExtendedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const result = await listingService.deleteListing(req.member, id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, deleteListing:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default listingController;
