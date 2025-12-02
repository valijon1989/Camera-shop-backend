import { FilterQuery } from "mongoose";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ListingModel from "../schema/Listing.model";
import { ListingInput, ListingInquiry } from "../libs/types/listing";
import { Member } from "../libs/types/member";

class ListingService {
  async createListing(member: Member, input: ListingInput) {
    const doc = await ListingModel.create({
      ...input,
      owner: member._id,
    });
    return doc;
  }

  async getListings(inquiry: ListingInquiry) {
    const page = inquiry.page && inquiry.page > 0 ? inquiry.page : 1;
    const limit = inquiry.limit && inquiry.limit > 0 ? inquiry.limit : 12;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<any> = {};

    if (inquiry.brand) filter.brand = inquiry.brand;
    if (inquiry.category) filter.category = inquiry.category;
    if (inquiry.condition) filter.condition = inquiry.condition;
    if (inquiry.location) filter.location = inquiry.location;
    if (inquiry.resolutionMp) filter.resolutionMp = inquiry.resolutionMp;
    if (inquiry.sensorType) filter.sensorType = inquiry.sensorType;
    if (inquiry.mountType) filter.mountType = inquiry.mountType;
    if (inquiry.videoResolution) filter.videoResolution = inquiry.videoResolution;
    if (inquiry.isoRange) filter.isoRange = inquiry.isoRange;
    if (inquiry.stabilization) filter.stabilization = inquiry.stabilization;
    if (inquiry.minPrice || inquiry.maxPrice) {
      filter.price = {};
      if (inquiry.minPrice) (filter.price as any)["$gte"] = inquiry.minPrice;
      if (inquiry.maxPrice) (filter.price as any)["$lte"] = inquiry.maxPrice;
    }
    if (inquiry.keyword) {
      filter.$text = { $search: inquiry.keyword };
    }

    const [items, total] = await Promise.all([
      ListingModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ListingModel.countDocuments(filter),
    ]);

    return {
      data: items,
      page,
      limit,
      total,
    };
  }

  async getListingById(id: string) {
    const doc = await ListingModel.findById(id).lean();
    if (!doc) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return doc;
  }

  async getMyListings(member: Member) {
    const docs = await ListingModel.find({ owner: member._id })
      .sort({ createdAt: -1 })
      .lean();
    return docs;
  }

  async deleteListing(member: Member, id: string) {
    const doc = await ListingModel.findById(id);
    if (!doc) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (String(doc.owner) !== String(member._id)) {
      throw new Errors(HttpCode.FORBIDDEN, Message.FORBIDDEN);
    }

    await doc.deleteOne();
    return { ok: true };
  }
}

export default ListingService;
