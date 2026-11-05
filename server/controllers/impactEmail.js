import nodemailer from 'nodemailer';
import Donation from '../models/donation.js';
import Photo from '../models/photo.js';
import User from '../models/users.js';
import Program from '../models/programs.js';

// Part E: Send Impact Email Digest
export const sendImpactEmail = async (userId) => {
    try {
        // Find user
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found.");
            return;
        }

        // Find a recent donation program
        const recentDonation = await Donation.findOne({ user: userId }).sort({ date: -1 }).populate('program');
        if (!recentDonation || !recentDonation.program) {
            console.log("No recent donations found for user.");
            return;
        }

        const program = recentDonation.program;

        // Fetch recent photos for that program
        const photos = await Photo.find({ programId: program._id, verified: true })
            .sort({ uploadDate: -1 })
            .limit(3);

        if (photos.length === 0) {
            console.log("No recent photos for this program yet.");
            return;
        }

        // Basic nodemailer config (placeholder)
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email', // Placeholder SMTP
            port: 587,
            auth: {
                user: 'placeholder_user@ethereal.email',
                pass: 'placeholder_password'
            }
        });

        const photoHtml = photos.map(p => `
            <div style="margin-bottom: 20px;">
                <img src="${p.photoUrl || `http://localhost:5000/api/admin/getPhoto/${p.imageId}`}" alt="Tree" width="300" style="border-radius: 8px;" />
                <p><strong>Species:</strong> ${p.treeSpecies}</p>
                <p>${p.description}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: '"GreenRoots" <impact@greenroots.com>',
            to: user.email,
            subject: `Your impact is growing: Updates from ${program.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2>Hello ${user.username},</h2>
                    <p>Thank you so much for your recent donation of ₹${recentDonation.amount} to <strong>${program.title}</strong>.</p>
                    <p>Because of donors like you, we're making real progress. Here are a few recently planted trees from this program:</p>
                    
                    <div style="margin-top: 20px;">
                        ${photoHtml}
                    </div>

                    <p>Thank you for making the world greener!</p>
                    <p>— The GreenRoots Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Impact email sent: %s", info.messageId);

    } catch (error) {
        console.error("Error sending impact email:", error);
    }
};
