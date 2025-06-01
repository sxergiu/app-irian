package com.app.backend.config.seeder;


import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.group.GroupJPARepository;
import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.GeoLocation;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.domain.user.AppUser;
import com.app.backend.domain.user.UserJPARepository;
import com.app.backend.domain.user.UserRole;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Component
public class DataSeeder {

    private final BookingJPARepository bookingJPARepository;
    private final GroupJPARepository groupJPARepository;
    private final RoomJPARepository roomJPARepository;
    private final UserJPARepository userJPARepository;
    private final PasswordEncoder encoder;

    public DataSeeder(BookingJPARepository bookingJPARepository,
                      GroupJPARepository groupJPARepository,
                      RoomJPARepository roomJPARepository,
                      UserJPARepository userJPARepository, PasswordEncoder encoder) {

        this.bookingJPARepository = bookingJPARepository;
        this.groupJPARepository = groupJPARepository;
        this.roomJPARepository = roomJPARepository;
        this.userJPARepository = userJPARepository;
        this.encoder = encoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    void init() {

            AppUser adminUser = new AppUser();
            adminUser.setName("Adminul");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(encoder.encode("admin"));
            adminUser.setRole(UserRole.ADMIN);
            userJPARepository.save(adminUser);

            AppUser simpleUser = new AppUser();
            simpleUser.setName("Charlie");
            simpleUser.setEmail("sx@gmail.com");
            simpleUser.setPassword(encoder.encode("123123"));
            simpleUser.setRole(UserRole.USER);
            userJPARepository.save(simpleUser);

            AppUser simpleUser1 = new AppUser();
            simpleUser1.setName("John");
            simpleUser1.setEmail("john@gmail.com");
            simpleUser1.setPassword(encoder.encode("123123"));
            simpleUser1.setRole(UserRole.USER);
            userJPARepository.save(simpleUser1);

            Room room1 = new Room();
            room1.setName("Ocean View Meeting Room");
            room1.setLocation("San Francisco");
            room1.setCapacity(12);
            room1.setAmenities(Set.of("Projector", "Whiteboard", "Wi-Fi"));
            room1.setCoordinates(new GeoLocation(37.7749, -122.4194));

            Room room2 = new Room();
            room2.setName("Downtown Conference Hall");
            room2.setLocation("New York");
            room2.setCapacity(25);
            room2.setAmenities(Set.of("TV", "Microphone", "Coffee Machine"));
            room2.setCoordinates(new GeoLocation(40.7128, -74.0060));

            Room room3 = new Room();
            room3.setName("Creative Studio");
            room3.setLocation("Berlin");
            room3.setCapacity(8);
            room3.setAmenities(Set.of("Whiteboard", "Sound System"));
            room3.setCoordinates(new GeoLocation(52.5200, 13.4050));

            Room room4 = new Room();
            room4.setName("Skyline Boardroom");
            room4.setLocation("Chicago");
            room4.setCapacity(15);
            room4.setAmenities(Set.of("Projector", "Conference Phone", "Wi-Fi"));
            room4.setCoordinates(new GeoLocation(41.8781, -87.6298));

            Room room5 = new Room();
            room5.setName("Innovation Hub");
            room5.setLocation("London");
            room5.setCapacity(10);
            room5.setAmenities(Set.of("Smart TV", "Whiteboard", "Coffee Machine"));
            room5.setCoordinates(new GeoLocation(51.5074, -0.1278));

            Room room6 = new Room();
            room6.setName("Tech Talk Space");
            room6.setLocation("Tokyo");
            room6.setCapacity(20);
            room6.setAmenities(Set.of("Microphone", "Projector", "Wi-Fi", "Sound System"));
            room6.setCoordinates(new GeoLocation(35.6895, 139.6917));

            Room room7 = new Room();
            room7.setName("Mountain View Lab");
            room7.setLocation("Zurich");
            room7.setCapacity(6);
            room7.setAmenities(Set.of("Whiteboard", "High-Speed Wi-Fi"));
            room7.setCoordinates(new GeoLocation(47.3769, 8.5417));

            Room room8 = new Room();
            room8.setName("Lakeside Meeting Spot");
            room8.setLocation("Toronto");
            room8.setCapacity(18);
            room8.setAmenities(Set.of("TV", "Coffee Machine", "Wi-Fi", "Projector"));
            room8.setCoordinates(new GeoLocation(43.6532, -79.3832));
            roomJPARepository.saveAll(List.of(room1, room2, room3, room4, room5, room6, room7, room8));

            NamedGroup group1 = new NamedGroup();
            group1.setName("Mario Karts");
            group1.setNumberOfPeople(20);

            NamedGroup group2 = new NamedGroup();
            group2.setName("Bowser Bullies");
            group2.setNumberOfPeople(5);

            NamedGroup group3 = new NamedGroup();
            group3.setName("Lunch Luigis");
            group3.setNumberOfPeople(50);

            NamedGroup group4 = new NamedGroup();
            group4.setName("Pepper Peaches");
            group4.setNumberOfPeople(15);

            groupJPARepository.saveAll(List.of(group1, group2, group3, group4));

            Booking booking1 = new Booking();
            booking1.setRoom(room1);
            booking1.setDate(LocalDate.of(2025, 6, 15));
            booking1.setTime( new TimeInterval(LocalTime.of(9, 0),LocalTime.of(11, 0)) );
            booking1.setUser(simpleUser);
            booking1.setNamedGroup(group1);

            Booking booking2 = new Booking();
            booking2.setRoom(room1);
            booking2.setDate(LocalDate.of(2025, 6, 15));
            booking2.setTime( new TimeInterval(LocalTime.of(12, 0), LocalTime.of(13, 0)));
            booking2.setUser(simpleUser);
            booking2.setNamedGroup(group2);

            Booking booking3 = new Booking();
            booking3.setRoom(room2);
            booking3.setDate(LocalDate.of(2025, 6, 10));
            booking3.setTime( new TimeInterval(LocalTime.of(7, 0),LocalTime.of(8, 0)));
            booking3.setUser(simpleUser1);
            booking3.setNamedGroup(group3);

            Booking booking4 = new Booking();
            booking4.setRoom(room2);
            booking4.setDate(LocalDate.of(2025, 6, 15));
            booking4.setTime( new TimeInterval(LocalTime.of(17, 0), LocalTime.of(21, 0)));
            booking4.setUser(simpleUser);
            booking4.setNamedGroup(group4);

            Booking booking5 = new Booking();
            booking5.setRoom(room6);
            booking5.setDate(LocalDate.of(2021, 6, 16));
            booking5.setTime(new TimeInterval( LocalTime.of(11, 0),LocalTime.of(12, 0)));
            booking5.setUser(simpleUser);
            booking5.setNamedGroup(group4);

            Booking booking6 = new Booking();
            booking6.setRoom(room5);
            booking6.setDate(LocalDate.of(2026, 5, 20));
            booking6.setTime( new TimeInterval(LocalTime.of(10, 0), LocalTime.of(16, 0)));
            booking6.setUser(simpleUser1);
            booking6.setNamedGroup(group1);

            Booking booking7 = new Booking();
            booking7.setRoom(room2);
            booking7.setDate(LocalDate.of(2026, 6, 14));
            booking7.setTime( new TimeInterval(LocalTime.of(17, 0), LocalTime.of(18, 0)));
            booking7.setUser(simpleUser);
            booking7.setNamedGroup(group1);

            Booking booking8 = new Booking();
            booking8.setRoom(room5);
            booking8.setDate(LocalDate.of(2026, 6, 23));
            booking8.setTime( new TimeInterval(LocalTime.of(17, 0), LocalTime.of(18, 0)));
            booking8.setUser(simpleUser1);
            booking8.setNamedGroup(group2);

            Booking booking9 = new Booking();
            booking9.setRoom(room1);
            booking9.setDate(LocalDate.of(2026, 6, 30));
            booking9.setTime( new TimeInterval(LocalTime.of(7, 0), LocalTime.of(17, 0)));
            booking9.setUser(simpleUser1);
            booking9.setNamedGroup(group2);

            bookingJPARepository.saveAll(List.of(booking1, booking2, booking3, booking4, booking5, booking6,booking7,booking8,booking9));

            System.out.println("Database seeded.");
    }
}
