import { Genus } from "../models";

export async function create({name}) {
    const genus = new Genus({
        name
    });
    await genus.save();
    return genus;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: {name: q}}),
    };

    const genuss = (
        await Genus.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    );
    const total = await Genus.countDocuments(filter);
    return {total, page, per_page, genuss};
}

export async function details(genusId) {
    const genus = await Genus.findById(genusId);
    return genus;
}

export async function update(genus, {name}) {
    genus.name = name;
    await genus.save();
    return genus;
}


export async function remove(genus) {
    await Genus.deleteOne({_id: genus._id});
}
