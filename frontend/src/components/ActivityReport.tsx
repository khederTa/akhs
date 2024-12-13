/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { DirectionContext } from "../shared-theme/AppTheme";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/dateUtils";
import { Loading } from "./Loading";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

// Register a font that supports Arabic
Font.register({
  family: "Cairo",
  fonts: [
    {
      src: `fonts/Cairo-Regular.ttf`,
    },
    {
      src: `fonts/Cairo-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

const VOLUNTEERS_PER_PAGE = 10;
const SESSIONS_PER_PAGE = 5;

export default function ActivityReport() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [activityTitle, setActivityTitle] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const { direction } = useContext(DirectionContext);
  const { t } = useTranslation();
  const location = useLocation();

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      flexDirection: "column",
      textAlign: direction === "rtl" ? "right" : "left",
      fontSize: 11,
      fontFamily: "Cairo",
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    section: {
      marginBottom: 10,
      textAlign: direction === "rtl" ? "right" : "left",
      alignSelf: direction === "rtl" ? "flex-end" : "flex-start",
      direction: direction,
    },
    table: {
      display: "flex",
      flexDirection: "column",
      marginTop: 20,
    },
    row: {
      flexDirection: direction === "rtl" ? "row-reverse" : "row",
      borderBottom: "1px solid black",
      paddingVertical: 5,
    },
    cell: { flex: 1, padding: 4 },
    header: {
      fontWeight: 500,
      alignItems: "center",
      backgroundColor: "#ddd",
      padding: 4,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityTypeResponse, departmentResponse, activityResponse] =
          await Promise.all([
            axios.get("/activityType"),
            axios.get("/department"),
            axios.get(`/activity/${location.state.id}`),
          ]);

        setActivityTitle(activityResponse.data.title);
        setStartDate(activityResponse.data.startDate);
        setActivityType(
          activityTypeResponse.data.find(
            (type: any) => type.id === activityResponse.data.activityTypeId
          )?.name || ""
        );
        setDepartment(
          departmentResponse.data.find(
            (dep: any) => dep.id === activityResponse.data.departmentId
          )?.name || ""
        );

        const processedSessions = activityResponse.data.Sessions.map(
          (session: any) => ({
            id: session.id,
            sessionName: session.name,
            hallName: session.hall_name,
            dateValue: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            providerNames: session.ServiceProviders.map((provider: any) => ({
              label: `${provider.Volunteer.Person.fname} ${provider.Volunteer.Person.lname}`,
              value: provider.providerId,
            })),
          })
        );

        const volunteersData = activityResponse.data.Volunteers.map(
          (volunteer: any) => {
            const attendance = activityResponse.data.Sessions.reduce(
              (acc: any, session: any) => ({
                ...acc,
                [`${session.name}_${session.id}`]: session.Attendees.some(
                  (attendee: any) =>
                    attendee.volunteerId === volunteer.volunteerId &&
                    attendee.VolunteerAttendedSessions?.status === "attended"
                ),
              }),
              {}
            );

            return {
              id: volunteer.volunteerId,
              fullName: `${volunteer.Person.fname} ${volunteer.Person.lname}`,
              notes: volunteer.VolunteerAttendedActivity.notes || "",
              volunteerAttendedActivity:
                volunteer.VolunteerAttendedActivity.status === "attended",
              ...attendance,
            };
          }
        );

        setVolunteers(volunteersData);
        setSessions(processedSessions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state.id]);

  return loading ? (
    <Loading />
  ) : (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document title={t(activityTitle)}>
        {/* General Info Page */}
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>{t("activity report")}</Text>
          <Text style={styles.section}>{`${t(
            "title"
          )}: ${activityTitle}`}</Text>
          <Text style={styles.section}>{`${t(
            "activity type"
          )}: ${activityType}`}</Text>
          <Text style={styles.section}>{`${t(
            "department"
          )}: ${department}`}</Text>
          <Text style={styles.section}>{`${t("start date")}: ${formatDate(
            startDate
          )}`}</Text>
          <View style={styles.table} key={0}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.header]}>
                {t("session name")}
              </Text>
              <Text style={[styles.cell, styles.header]}>{t("hall name")}</Text>
              <Text style={[styles.cell, styles.header]}>{t("date")}</Text>
              <Text style={[styles.cell, styles.header]}>
                {t("start time")}
              </Text>
              <Text style={[styles.cell, styles.header]}>{t("end time")}</Text>
              <Text style={[styles.cell, styles.header]}>
                {t("service providers")}
              </Text>
            </View>
            {sessions.slice(0, SESSIONS_PER_PAGE).map((session) => (
              <View style={styles.row} key={session.id}>
                <Text style={styles.cell}>{session.sessionName}</Text>
                <Text style={styles.cell}>{session.hallName}</Text>
                <Text style={styles.cell}>{formatDate(session.dateValue)}</Text>
                <Text style={styles.cell}>{session.startTime}</Text>
                <Text style={styles.cell}>{session.endTime}</Text>
                <Text style={styles.cell}>
                  {session.providerNames
                    .map((provider: { label: string }) => provider.label)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </View>
        </Page>
        {/* Paginated Sessions Table */}
        {Array.from(
          { length: Math.ceil(sessions.length / SESSIONS_PER_PAGE) - 1 },
          (_, pageIndex) => {
            const handledPageIndex = pageIndex + 1;
            const startIndex = handledPageIndex * SESSIONS_PER_PAGE;
            const endIndex = startIndex + SESSIONS_PER_PAGE;
            const paginatedSessions = sessions.slice(startIndex, endIndex);

            return (
              <Page size="A4" style={styles.page}>
                <View style={styles.table} key={pageIndex}>
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.header]}>
                      {t("session name")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("hall name")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("date")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("start time")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("end time")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("service providers")}
                    </Text>
                  </View>
                  {paginatedSessions.map((session) => (
                    <View style={styles.row} key={session.id}>
                      <Text style={styles.cell}>{session.sessionName}</Text>
                      <Text style={styles.cell}>{session.hallName}</Text>
                      <Text style={styles.cell}>
                        {formatDate(session.dateValue)}
                      </Text>
                      <Text style={styles.cell}>{session.startTime}</Text>
                      <Text style={styles.cell}>{session.endTime}</Text>
                      <Text style={styles.cell}>
                        {session.providerNames
                          .map((provider: { label: string }) => provider.label)
                          .join(", ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </Page>
            );
          }
        )}

        {/* Volunteer Attendance Pages */}
        {Array.from(
          { length: Math.ceil(volunteers.length / VOLUNTEERS_PER_PAGE) },
          (_, pageIndex) => {
            const startIndex = pageIndex * VOLUNTEERS_PER_PAGE;
            const endIndex = startIndex + VOLUNTEERS_PER_PAGE;
            const paginatedVolunteers = volunteers.slice(startIndex, endIndex);

            return (
              <Page size="A4" key={pageIndex} style={styles.page}>
                {pageIndex === 0 && (
                  <Text style={styles.title}>{t("attendance table")}</Text>
                )}
                <View style={styles.table}>
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.header]}>
                      {t("fullName")}
                    </Text>
                    {sessions.map((session) => (
                      <Text
                        style={[styles.cell, styles.header]}
                        key={`${session.id}_header`}
                      >
                        {t(session.sessionName)}
                      </Text>
                    ))}
                    <Text style={[styles.cell, styles.header]}>
                      {t("activity attended")}
                    </Text>
                    <Text style={[styles.cell, styles.header]}>
                      {t("notes")}
                    </Text>
                  </View>
                  {paginatedVolunteers.map((volunteer) => (
                    <View style={styles.row} key={volunteer.id}>
                      <Text style={styles.cell}>{volunteer.fullName}</Text>
                      {sessions.map((session) => (
                        <Text
                          style={styles.cell}
                          key={`${session.id}_${volunteer.id}`}
                        >
                          {volunteer[`${session.sessionName}_${session.id}`]
                            ? t("attended")
                            : t("not attended")}
                        </Text>
                      ))}
                      <Text style={styles.cell}>
                        {volunteer.volunteerAttendedActivity
                          ? t("yes")
                          : t("no")}
                      </Text>
                      <Text style={styles.cell}>{volunteer.notes}</Text>
                    </View>
                  ))}
                </View>
              </Page>
            );
          }
        )}
      </Document>
    </PDFViewer>
  );
}
