import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import RoomBooking from "@/models/RoomBokking";
import Room from "@/models/Room";
import FoodOrder from "@/models/FoodOrder";


export async function GET() {
    try {
        await connectDB();

        const [totalBookings,totalRooms, activeBookings,servedFoodOrders, roomRevenueAgg] = await Promise.all([
            RoomBooking.countDocuments(), // total booking
            Room.countDocuments(), // total room 
            RoomBooking.countDocuments({ status: 'checked-in' }), //activeBookings
            FoodOrder.find({ orderStatus: 'Served' }).select('totalBill'), // servedFoodOrders
            RoomBooking.aggregate([
                { $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }}
            ]), // room booking Agg


        ]);

        const foodRevenue = servedFoodOrders.reduce((sum,order)=> sum + order.totalBill,0);
        const roomRevenue = roomRevenueAgg.length > 0 ? roomRevenueAgg[0].total : 0;

        const totalRevenue = foodRevenue + roomRevenue;

        return NextResponse.json({
            success : true,
            stats : {
                totalBookings,
                totalRooms,
                activeGuests : activeBookings,
                revenue : totalRevenue.toFixed(2), // Total revenue eka 2 decimal places walin display karanna
                occupancyRate : (activeBookings / totalRooms * 100).toFixed(2) + "%", // Occupancy rate eka percentage walin display karanna
            }
        })
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch stats"
        }, { status: 500 });

    }
    
}

